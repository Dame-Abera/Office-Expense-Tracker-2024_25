import { Controller, Post, Body,ParseIntPipe} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
@Controller("auth")
export class AuthController{
    constructor(private authService:AuthService){}
        @Post("signup")
        signup(@Body()dto:SignupDto){
            console.log({
                dto

                

            })
           return   this.authService.signup(dto)
             
        }
        @Post("login")
        signin(@Body() dto: LoginDto) {
            console.log({
                dto, 
            })
            return this.authService.login(dto);
        }
    }
    
 
