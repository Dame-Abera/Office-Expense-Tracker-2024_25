import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  @IsNumber()
    amount?: number;
    
  @IsNotEmpty()
  @IsString()
  description: string;
}
