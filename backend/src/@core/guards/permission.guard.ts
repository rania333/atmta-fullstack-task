import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSION_KEY } from '../decorators/require-permission.decorator.js';
import { UsersService } from '../../@features/users/users.service.js';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this._reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const userId = request.user.sub;

    const permissions = await this.usersService.getEffectivePermissions(userId);

    const hasPermission = permissions.includes(requiredPermission);

    if (!hasPermission) {
      throw new ForbiddenException( `You don't have permission: ${requiredPermission}`);
    }

    return true;
  }
}