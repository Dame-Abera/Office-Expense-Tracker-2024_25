import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ForbiddenException
} from '@nestjs/common';

import { ExpenseService } from './expenses.service';
import { CreateExpenseDto } from './dto/create.expense.dto';
import { UpdateExpenseDto } from './dto/update.expense.dto';

import { GetUser } from '../auth/decorator';
import { JwtGuard} from '../auth/guard';
@UseGuards(JwtGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get('all')
getAllExpenses(@GetUser() user: any) {
  console.log(user)
  if (user.role !== 'CEO') {
    throw new ForbiddenException('Access denied');
  }
  return this.expenseService.getAllExpenses();
}

  @Get()
  getExpenses(@GetUser('id') userId: number) {
    return this.expenseService.getExpenses(
      userId,
    );
  }
  // Example NestJS controller for admin to fetch all expenses


  @Get(':id')
  getExpenseById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) ExpenseId: number,
  ) {
    return this.expenseService.getExpenseById(
      userId,
      ExpenseId,
    );
  }

 
  @Post()
  createExpense(
    @GetUser('id') userId: number,
    @Body() dto: CreateExpenseDto,
  ){return this.expenseService.createExpense(
      userId,
      dto,
    );
  }

  @Patch(':id')
  updateExpenseById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) ExpenseId: number,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expenseService.updateExpenseById(
      userId,
      ExpenseId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteExpenseById(
    @GetUser('id') userId: number,
    @GetUser('role') userRole: string,
    @Param('id', ParseIntPipe) expenseId: number,
  ) {
    return this.expenseService.deleteExpenseById(
      userId,
      expenseId,
       userRole

    );
  }
}
