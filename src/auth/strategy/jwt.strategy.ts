import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config/dist";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt',
) {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }
    async validate(payload: any) {
        return payload // On peut soit retourner le payload, soit chercher l'utilisateur et le renvoyer, sans le mot de passe ofc
        // const user = await this.prisma.user.findUnique({
        //     where: {
        //         id: payload.sub,
        //     }
        // })
        // delete user.hash // ne pas oublier de supprimer le mot de passe
        // return user
    }
}