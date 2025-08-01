import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { MonthService } from './month.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { getDataMonthDTO } from './dtos/get-data-month.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserEntity } from 'src/auth/entities/auth.entity';
import { httpResponse } from 'src/common/utils/http-response.util';
import { UpdateSalaryByMonthDTO } from './dtos/update-salary-by-month.dto';

@Controller('month')
export class MonthController {

    constructor(
        private readonly monthService: MonthService
    ){}

    @Get('data')
    @Auth()
    async getData(
        @Query('year') year: string,
        @Query('month') month: string,
        @GetUser() user: UserEntity
    ){
        const res = await this.monthService.getData(year,month, user)

        return httpResponse(res, 'Se encontro la data correctamente')
    }

    @Patch('update-salary')
    @Auth()
    async updateSalaryByMonth(
        @Body() updateSalaryByMonthDTO: UpdateSalaryByMonthDTO,
        @GetUser() user: UserEntity
    ){
        const res = await this.monthService.updateSalaryByMonth(updateSalaryByMonthDTO, user)

        return httpResponse(res, 'Se actualizo la informacion correctamente')
    }

    @Get('initialize-months')
    @Auth()
        async initializeMonths(@GetUser() user: UserEntity) {

        const res = await this.monthService.ensureMonthlyRecordsForCurrentYear(user);

        return httpResponse(null, res)

        
    }
}
