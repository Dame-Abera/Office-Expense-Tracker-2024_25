import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto): Promise<object | null> {
    // Generate the password hash
    const hash = await argon.hash(dto.password);
    // Save the user
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          role: dto.role || 'EMPLOYEE',
        },
      });
      return this.signToken(user.id, user.email,user.role);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDto):  Promise<object | null> {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // Compare the password
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // Return the user
    return this.signToken(user.id, user.email,user.role);
  }

 

  async signToken(
    userId: number,
    email: string,
    role:string
  ): Promise<object | null> {
    const payload = {
      sub: userId,
      email,
      role,
    };
    console.log(payload.role);
    const secret = this.config.get<string>('JWT_SECRET');
    ;

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '1d',
        secret: secret,
      },
    );

    return {
      access_token: token,
      role:payload.role,

      
    };
  }

  validateToken(token: string) {
    return this.jwt.verify(token, {
        secret : process.env.JWT_SECRET
    });
}

}