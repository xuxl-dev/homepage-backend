import { UseGuards, applyDecorators } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { RolesGuard } from "../roles/roles.guard";
import { AttributeGuard } from "../attrs/attr.guards";

//@authedGuards decorator, contains jwt and roles guard
export function authedGuard(...guards: any[]) {
    return applyDecorators(
        UseGuards(AuthGuard('jwt'), RolesGuard, ...guards),
        ApiBearerAuth(),
    );
}

//@jwtGuards decorator, contains jwt guard
export function jwtGuard(...guards: any[]) {
    return applyDecorators(
        UseGuards(AuthGuard('jwt'), ...guards),
    );
}

//@noGuards decorator, contains no guards
export function noGuard() {
    return applyDecorators(
       
    );
}

export function PermissionGuard(...guards: any[]) {
    return applyDecorators(
        UseGuards(AttributeGuard, ...guards),
    );
}

export default {authedGuard, jwtGuard, noGuard, PermissionGuard};