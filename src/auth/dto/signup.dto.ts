import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty ,IsOptional, IsEnum} from 'class-validator';


export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional() // The role is optional; defaults to EMPLOYEE
  @IsEnum(['CEO', 'EMPLOYEE'], {
    message: 'Role must be either CEO or EMPLOYEE',
  })
  role?: Role;
   
}
