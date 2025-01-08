import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create.expense.dto';
import { UpdateExpenseDto } from './dto/update.expense.dto';
@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  getAllExpenses() {
    return this.prisma.expense.findMany({ orderBy: { name: 'asc' },});
  }
  getExpenses(userId: number) {
    return this.prisma.expense.findMany({
      where: {
        userId,
      },
    });
  }
  getExpenseById(
    userId: number,
    ExpenseId: number,
  ) {
    return this.prisma.expense.findFirst({
      where: {
        id: ExpenseId,
        userId,
      },
    });
  }
  async createExpense(
    userId: number,
    dto: CreateExpenseDto,
  ) {
    const expense =
      await this.prisma.expense.create({
        data: {
          userId:userId,
          name: dto.name,
          description: dto.description,
          amount: dto.amount,
        },
      });
console.log(expense)
    return expense;
  }

  async updateExpenseById(userId: number, 
    expenseId: number, 
    dto: UpdateExpenseDto
  ) {
    // get the expense by id
    const expense = await this.prisma.expense.findUnique({
      where: {
        id: expenseId,
        
      },
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    return this.prisma.expense.update({
      where: {
        id: expenseId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteExpenseById(userId: number, expenseId: number) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId,
      },
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    return this.prisma.expense.delete({
      where: {
        id: expenseId,
      },
      
    });
  }
}
