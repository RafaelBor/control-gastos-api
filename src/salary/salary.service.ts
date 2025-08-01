import { InjectRepository } from '@nestjs/typeorm';
import { addSalaryDto } from './dtos/add_salary.dto';
import { HttpException, Injectable } from '@nestjs/common';
import { UserInfoEntity } from 'src/common/entities/user_info.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/auth/entities/auth.entity';
import { MonthEntity } from 'src/month/entities/month.entity';

@Injectable()
export class SalaryService {

    constructor(
        @InjectRepository(UserInfoEntity)
        private readonly userInfoRepository: Repository<UserInfoEntity>,
        @InjectRepository(MonthEntity)
        private readonly monthRepository: Repository<MonthEntity>
    ){}

   async add(addSalaryDto: addSalaryDto, user: UserEntity){

      try {
       await this.userInfoRepository.update({user: user }, {
            salary: addSalaryDto.salary
        })

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        for (let month = currentMonth; month < 12; month++) {
            const date = new Date(currentYear, month, 1); // Día 1 de cada mes

            // Verificar si ya existe un registro para este mes
            const existingMonthly = await this.monthRepository.findOneBy({
                date_month: date,
                usuario: user,
            });
  
            if (existingMonthly) {
                // Si existe, actualizar el salary_montly
                existingMonthly.salary_montly = addSalaryDto.salary;
                await this.monthRepository.save(existingMonthly);
            } else {
                // Si no existe, crear uno nuevo
                const monthlySalary = this.monthRepository.create({
                date_month: date,
                salary_montly: addSalaryDto.salary,
                savings_montly: 0,
                usuario: user,
                });
        
                await this.monthRepository.save(monthlySalary);
            }
        }
      } catch (error) {
        console.log('error',error)
        if (error instanceof HttpException) {
            throw error;
        }
      }


    }
}
