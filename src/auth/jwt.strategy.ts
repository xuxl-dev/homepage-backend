import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, Request, Req } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { StrategyOptions, Strategy, ExtractJwt, JwtFromRequestFunction } from 'passport-jwt';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from '../db/redis/cache.service';

export class JwtStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRES_IN'),
      },
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(@Req() req: Request, user: Partial<User>) {
    const existUser = await this.authService.getUser(user);
    if (!existUser) {
      throw new UnauthorizedException({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '未登录',
        success: true,
      });
    }
    // if expired, token is not in redis
    const token = await this.cacheService.get('token:', user.id.toString());
    if (!token) {
      console.log('token is expired');
      throw new UnauthorizedException({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '已登出的会话',
        success: true,
      });
    }
    const auth_header = req.headers['authorization']?.split(' ')
    if (!auth_header|| auth_header.length !== 2) {
      throw new UnauthorizedException({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '非法参数',
        success: true,
      });
    }
    const header_token = auth_header[1];
    if(token !== header_token) {
      console.log('token is not match');
      throw new UnauthorizedException({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '无效的会话',
        success: true,
      });
    }

    // if token is not expired, update token expire time
    await this.cacheService.set('token:',
      async () => token, this.configService.get('JWT_EXPIRES_IN_SEC') ?? 86400,
      user.id.toString()
    );

    return existUser;
  }
}