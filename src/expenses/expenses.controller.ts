import { Auth } from 'src/auth/decorators/auth.decorator';
import { addExpenseDto } from './dtos/add_expense.dto';
import { ExpensesService } from './expenses.service';
import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserEntity } from 'src/auth/entities/auth.entity';
import { httpResponse } from 'src/common/utils/http-response.util';

@Controller('expenses')
export class ExpensesController {

    constructor(private readonly ExpensesService: ExpensesService){}

    
    @Post('add')
    @Auth()
    async add(
        @Body() addExpenseDto: addExpenseDto,
        @GetUser() user: UserEntity
    ) {
        const res = await this.ExpensesService.add(addExpenseDto, user);

        return httpResponse(res, 'Se ha agregado el gasto correctamente.')
    }

    @Get(':date')
    @Auth()
    async list(
        @Param('date') date: string,
        @GetUser() user: UserEntity
    ){
        const res = await this.ExpensesService.list(date, user);

        return httpResponse(res, 'Se ha listado la informacion correctamente.')
    }

    @Get('byId/:id')
    @Auth()
    async getExpenseById(
        @Param('id') id: string
    ){
        const res = await this.ExpensesService.getExpenseById(id);

        return httpResponse(res, 'Se encontro la informacion correctamente.')
    }

    @Put(':id')
    @Auth()
    async updateExpenseById(
        @Param('id') id: string,
        @Body() addExpenseDto: addExpenseDto,
        @GetUser() user: UserEntity
    ){
        const res = await this.ExpensesService.updateExpenseById(id, addExpenseDto, user);

        return httpResponse(res, 'El gasto se actualizo correctamente.')
    }

    @Delete(':id')
    @Auth()
    async deleteExpenseById(
        @Param('id') id: string,
        @GetUser() user: UserEntity
    ){
        const res = await this.ExpensesService.deleteExpenseById(id, user);

        return httpResponse(res, 'El gasto se elimino correctamente.')
    }
}
