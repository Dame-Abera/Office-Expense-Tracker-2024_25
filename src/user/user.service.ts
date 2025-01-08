import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Role } from '@prisma/client';
import * as argon2 from 'argon2'; // Import argon2 for hashing

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Retrieve all users
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }
  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Create a new user with password hashing
  async createUser(createUserDto: CreateUserDto, password: string) {
    const { email, role } = createUserDto;
    
    // Hash the password
    const hashedPassword = await argon2.hash(password);

    return this.prisma.user.create({
      data: {
        email,
        role,
        hash: hashedPassword, // Store the hashed password
      },
    });
  }

  // Update an existing user
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { email, role } = updateUserDto;

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        email: email ?? user.email,
        role: role ?? user.role,
      },
    });
  }

  // Delete a user by ID
  async deleteUser(id: number) {

    

    
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.delete({ where: {id } });
  }

  // Verify a user's password during login
  async verifyPassword(userId: number, plainPassword: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Compare the plain password with the stored hashed password
    return argon2.verify(user.hash, plainPassword);
  }
}
