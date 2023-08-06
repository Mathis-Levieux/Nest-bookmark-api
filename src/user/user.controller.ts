import { Controller, Get, UseGuards, Body, Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';


@UseGuards(JwtGuard) // au lieu de UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }
    // route : /users/me 
    @Get('me')
    getMe(@GetUser() user: User) {
        return user
    }

    @Patch()
    editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
        return this.userService.editUser(userId, dto)
    }
}