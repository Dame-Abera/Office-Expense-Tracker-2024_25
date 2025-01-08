// filepath: /c:/Users/Owner/OneDrive/Documents/nestjs/nestjs-api-tutorial/src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
@Module({
  imports: [AuthModule], 
  controllers: [UserController],
  providers: [UserService, PrismaService]
})
export class UserModule {}