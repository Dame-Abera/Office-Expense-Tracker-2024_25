import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>('role', context.getHandler());
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new ForbiddenException('Authorization header missing');

    const token = authHeader.split(' ')[1];
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    if (decoded.role !== requiredRole) {
      throw new ForbiddenException(`Access denied for role: ${decoded.role}`);
    }

    return true;
  }
}
