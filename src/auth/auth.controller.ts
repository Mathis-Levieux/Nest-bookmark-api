import { Body, Controller, HttpCode, HttpStatus, Post, } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signup(
        @Body() dto: AuthDto) {
        return this.authService.signup(dto)
    }

    @HttpCode(HttpStatus.OK) // Sert à renvoyer le code http souhaité. Vu qu'on ne crée rien avec signin, on peut renvoyer OK (200)
    @Post('signin')
    signin(
        @Body() dto: AuthDto) {
        return this.authService.signin(dto)
    }
}