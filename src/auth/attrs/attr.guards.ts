import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Premissions } from './attr.config';
import { User } from '../../user/entities/user.entity';
import { ATTR_KEY } from './attr.decorators';
import { AttrNode } from '../entities/attr.entity';

@Injectable()
export class AttributeGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requred_attrs = this.reflector.get<string[]>(ATTR_KEY, context.getHandler());
    if (!requred_attrs) {
      return true;  // no roles required
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const res = matchAttributes(requred_attrs, user);
    console.log('user', user)
    console.log('requred_attrs', requred_attrs)
    console.log('res', res)
    return res
  }
}


export function matchAttributes(requred_attrs: string[], usr: User): boolean {
  if (!usr || !usr.attributes || !usr.attributes.attribute) return false // if user has no attributes, return false
  const usrAttrs = usr.attributes.attribute
  if (!usrAttrs) return false  // if user has no attributes, return false
  if (usrAttrs['root']) return true // if user has root attribute, return true 
  for (const required_attr of requred_attrs) {
    if (!getPremissionNode(usrAttrs, required_attr.split('.'))) return false
    // if user does not have permission on required attribute, return false
  }
  return true // if all nodes pass, return true
}

function getPremissionNode(user_attrs: AttrNode, levels: string[]) {
  for (const lvl of levels) {
    if (!user_attrs[lvl]) return false // unable to find required node
    if (typeof user_attrs[lvl] === 'boolean' && user_attrs[lvl]) { //is leaf and test success
      return true
    } else if (typeof user_attrs[lvl] === 'object') { // is node
      return getPremissionNode(user_attrs[lvl] as AttrNode, levels.slice(1))
    }
  }
  return false // unable to find required node
}

