import { Controller, Get, Post, Body, Param, Patch, Delete,UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(parseInt(id, 10));
  }
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    return this.userService.createUser(createUserDto, password);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(parseInt(id, 10), updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(parseInt(id, 10));
  }
}