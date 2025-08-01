import { Injectable } from '@nestjs/common';
import { getDataMonthDTO } from './dtos/get-data-month.dto';
import { UserEntity } from 'src/auth/entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MonthEntity } from './entities/month.entity';
import { Between, Raw, Repository } from 'typeorm';
import { HttpExceptionWM } from 'src/common/exceptions/http.exception';
import { ExceptionEnum } from 'src/common/enum/exception.enum';
import { ExpenseEntity } from 'src/expenses/entities/expenses.entity';
import { UpdateSalaryByMonthDTO } from './dtos/update-salary-by-month.dto';

@Injectable()
export class MonthService {
    constructor(
        @InjectRepository(MonthEntity)
        private readonly monthRepository: Repository<MonthEntity>,
        @InjectRepository(ExpenseEntity)
        private readonly expenseRepository: Repository<ExpenseEntity>,
    ){}

    async getData(year:string, month:string, user: UserEntity){
        try {
            const getDate = await this.formateDate(year, month)
            const dataByMonth = await this.monthRepository.findOne({
                where: {
                    date_month: Raw(alias => `DATE(${alias}) = :date`, { date: getDate }),
                    usuario: user
                },
            });
            
            if(!dataByMonth)
                throw new HttpExceptionWM({
                    statusCode: 400,
                    type: ExceptionEnum.NOT_FOUND,
                    message: `No se encontro informacion para la fecha: ${getDate}`,
            });
            
            const expenses = await this.expenseRepository
            .createQueryBuilder("expense")
            .select("category.id", "categoryId")
            .addSelect("category.name", "categoryName")
            .addSelect("category.color", "color")
            .addSelect("SUM(expense.expense)", "totalExpense")
            .innerJoin("expense.category", "category")
            .where("expense.monthId = :monthId", { monthId: dataByMonth.id })
            .groupBy("category.id, category.name")
            .getRawMany();
        
            return {
                month: dataByMonth,
                expenses: expenses
            };
            
        } catch (error) {
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

    private async formateDate(year:string, month:string){
        // Mapeo de nombres de meses en español a números
        const monthsMap: Record<string, number> = {
            'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3, 'Mayo': 4, 'Junio': 5,
            'Julio': 6, 'Agosto': 7, 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
        };
    
        // Obtener el número del mes
        const monthIndex = monthsMap[month];
        if (monthIndex === undefined) {
            throw new Error(`Mes inválido: ${month}`);
        }
    
        // Crear la fecha en formato "YYYY-MM-DD"
        const formattedDate = new Date(parseInt(year), monthIndex, 1);
        const formattedDateString = formattedDate.toISOString().split('T')[0]; // Obtiene solo "YYYY-MM-DD"
        return formattedDateString;

    }

   private async getYearAndMonth(dateString: string){
        const date = new Date(dateString);

        // Obtener el año
        const year = date.getFullYear().toString();
      
        // Obtener el mes en español
        const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
      
        return { year, month: month.charAt(0).toUpperCase() + month.slice(1) };
    }

    async getMonthIdBydate(dateString: string, user: UserEntity){
        const {year, month} = await this.getYearAndMonth(dateString);

        const dateMonth = await this.formateDate(year, month)

        const monthData = await this.monthRepository.findOne({
            where: {
                date_month: Raw(alias => `DATE(${alias}) = :date`, { date: dateMonth }), // Corregido aquí
                usuario: user
            },
        });

        if(!monthData){
            throw new HttpExceptionWM({
                statusCode: 400,
                type: ExceptionEnum.NOT_FOUND,
                message: `No se encontro informacion para la fecha: ${dateMonth}`,
            });
        }

        return monthData;
    }

    async updateSalaryByMonth(request: UpdateSalaryByMonthDTO, user: UserEntity){
        try {
            const getDate = await this.formateDate(request.year, request.month)
            const dataByMonth = await this.monthRepository.findOne({
                where: {
                    date_month: Raw(alias => `DATE(${alias}) = :date`, { date: getDate }),
                    usuario: user
                },
            });
            
            if(!dataByMonth)
                throw new HttpExceptionWM({
                    statusCode: 400,
                    type: ExceptionEnum.NOT_FOUND,
                    message: `No se encontro informacion para la fecha: ${getDate}`,
            });

            const newSalary = request.type === 'add' ? Number(dataByMonth.salary_montly) + request.quantity : Number(dataByMonth.salary_montly) - request.quantity;

            await this.monthRepository.update(dataByMonth, {
                salary_montly: newSalary
            })

            return
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

    async ensureMonthlyRecordsForCurrentYear(user: UserEntity) {
        try {
            const currentYear = new Date().getFullYear();

            // Verifica si ya existen meses del año actual
            const existing = await this.monthRepository.count({
                where: {
                usuario: user,
                date_month: Between(new Date(currentYear, 0, 1), new Date(currentYear, 11, 31)),
                },
            });

            if (existing >= 12){
                return 'La data ya ha sido inicializada';
            }  // Ya se generaron todos los meses

            const months: MonthEntity[] = [];

            for (let month = 0; month < 12; month++) {
                const date = new Date(currentYear, month, 1);

                months.push(this.monthRepository.create({
                date_month: date,
                salary_montly: 0,
                savings_montly: 0,
                expenses_montly: 0,
                usuario: user,
                }));
            }

            await this.monthRepository.save(months); // Inserta todos en una sola operación

            return 'La data se ha inicializado se manera correcta';
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


    

}
