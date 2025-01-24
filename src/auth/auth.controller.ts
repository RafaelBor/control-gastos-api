import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';
import { createUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { User } from './entities/auth.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces/valid-role.interface';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  create(@Body() createUserDto: createUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: loginUserDto) {
    return this.authService.login(loginUserDto);
  }


  @Get('test')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  test(
    @GetUser() user: User,
    @GetUser('email') userEmail
    ){
    return{
      "test":true,
      user,
      userEmail
    }
  }


  @Get('test2')
  @Auth(ValidRoles.admin)
  test2(
    @GetUser() user: User,
    @GetUser('email') userEmail
    ){
    return{
      "test":true,
      user,
      userEmail
    }
  }
}
