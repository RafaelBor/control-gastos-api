import { addExpenseDto } from './dtos/add_expense.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseEntity } from './entities/expenses.entity';
import { Raw, Repository } from 'typeorm';
import { UserEntity } from 'src/auth/entities/auth.entity';
import { MonthEntity } from 'src/month/entities/month.entity';
import { HttpExceptionWM } from 'src/common/exceptions/http.exception';
import { ExceptionEnum } from 'src/common/enum/exception.enum';
import { MonthService } from 'src/month/month.service';

@Injectable()
export class ExpensesService {

    constructor(
        @InjectRepository(ExpenseEntity)
        private readonly expenseRepository: Repository<ExpenseEntity>,

        @InjectRepository(MonthEntity)
        private readonly monthRepository: Repository<MonthEntity>,

        private readonly monthService: MonthService
    ){}
    
    async add(addExpenseDto: addExpenseDto, user: UserEntity){
        try {

            const month = await this.monthService.getMonthIdBydate(addExpenseDto.date, user);

            if(!month)
                throw new HttpExceptionWM({
                    statusCode: 400,
                    type: ExceptionEnum.NOT_FOUND,
                    message: `No se encontro informacion para la fecha: ${addExpenseDto.date}`,
                });

            const expense = this.expenseRepository.create({
                expense:    addExpenseDto.expense,
                date:       addExpenseDto.date,
                detail:     addExpenseDto.detail,
                usuario:    user,
                month:      month,
                categoryId: addExpenseDto.categoryId
            })

            const expenseTotal = Number(month.expenses_montly) + Number(addExpenseDto.expense)
            month.expenses_montly = expenseTotal;
       
            await this.expenseRepository.save(expense)
            await this.monthRepository.save(month)

            return expense
        } catch (error) {
            if (error instanceof HttpExceptionWM) {
                throw error;
            }

            throw new HttpExceptionWM({
                statusCode: 500,
                type: ExceptionEnum.MS_ERROR,
                message: "Ocurrió un error interno al procesar la solicitud",
            });
        }
    }

    async list(date: string, user: UserEntity){
        const expenses = await this.expenseRepository.find(
            {
                where: {
                    date:       Raw(alias => `DATE(${alias}) = :date`, { date }),
                    usuario:    user
                }
            }
        )

        const totalExpense = expenses.reduce((sum, expense) => sum + Number(expense.expense), 0);

        return {
            expenses,
            totalExpense
        }
    }

    async getExpenseById(id: string){

        const expense = await this.expenseRepository.findOneBy({id: id})

        if(!expense)
        throw new HttpExceptionWM({
            statusCode: 400,
            type: ExceptionEnum.NOT_FOUND,
            message: `No se encontro informacion`,
        });

        return expense;

    }

    async updateExpenseById(id: string, addExpenseDto: addExpenseDto, user: UserEntity){
        try {

            const existingExpense = await this.expenseRepository.findOne({
                    where: { id },
                    relations: ['month'],
                });

            if (!existingExpense) {
                throw new HttpExceptionWM({
                    statusCode: 404,
                    type: ExceptionEnum.NOT_FOUND,
                    message: 'Gasto no encontrado',
                });
            }

            const oldExpenseAmount = Number(existingExpense.expense);
            const newExpenseAmount = Number(addExpenseDto.expense);
            const difference = newExpenseAmount - oldExpenseAmount;

            const month = existingExpense.month;
            month.expenses_montly = Number(month.expenses_montly) + difference;

            await this.expenseRepository.update(id, {
                expense: addExpenseDto.expense,
                detail: addExpenseDto.detail,
                category: {
                    id: addExpenseDto.categoryId
                }
            })
            await this.monthRepository.save(month);

            return;
        } catch (error) {
               console.log(error)
              // Si el error ya es una instancia de HttpExceptionWM, lo relanzamos directamente.
              if (error instanceof HttpExceptionWM) {
                throw error;
            }

            // Si el error es diferente, devolvemos un error genérico de servidor
            throw new HttpExceptionWM({
                statusCode: 500,
                type: ExceptionEnum.MS_ERROR,
                message: "Ocurrió un error interno al procesar la solicitud",
            });
        }
    }

    async deleteExpenseById(id: string, user: UserEntity){
        try {
            const expense = await this.expenseRepository.findOne({
                    where: { id },
                    relations: ['month'],
            })


            if(!expense)
                  throw new HttpExceptionWM({
                    statusCode: 400,
                    type: ExceptionEnum.NOT_FOUND,
                    message: `No se encontro informacion para el gasto`,
                });


            const month = expense.month;
            const expenseTotal = Number(month.expenses_montly) - Number(expense.expense)
            month.expenses_montly = expenseTotal;
            
            await this.expenseRepository.delete(id)
            await this.monthRepository.save(month)

            return;
        } catch (error) {
            console.log(error)
            if (error instanceof HttpExceptionWM) {
                throw error;
            }

            throw new HttpExceptionWM({
                statusCode: 500,
                type: ExceptionEnum.MS_ERROR,
                message: "Ocurrió un error interno al procesar la solicitud",
            });
        }
    }

}
