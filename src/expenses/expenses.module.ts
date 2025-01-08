import { Module } from '@nestjs/common';
import { ExpenseController } from './expenses.controller';
import { ExpenseService } from './expenses.service';

@Module({
  
  controllers: [ExpenseController],
  providers: [ExpenseService]
})
export class ExpenseModule {}
