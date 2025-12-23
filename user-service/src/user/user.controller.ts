import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    return await this.userService.login(email, password);
  }

  @Get('profile')
  async getProfile(@Body('token') token: string) {
    return await this.userService.getProfile(token);
  }
}
