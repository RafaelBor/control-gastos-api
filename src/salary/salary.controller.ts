import { Body, Controller, Patch, Post, Put } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { addSalaryDto } from './dtos/add_salary.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserEntity } from 'src/auth/entities/auth.entity';
import { httpResponse } from 'src/common/utils/http-response.util';

@Controller('salary')
export class SalaryController {

    constructor(private readonly salaryService: SalaryService) {}

    @Patch('update')
    @Auth()
    async create(
        @Body() addSalaryDto: addSalaryDto,
        @GetUser() user: UserEntity
    ) {
        const res = await this.salaryService.add(addSalaryDto, user);

         return httpResponse(res, 'Se actualizo la informacion correctamente')
    }
}
