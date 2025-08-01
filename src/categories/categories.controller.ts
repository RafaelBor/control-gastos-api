import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserEntity } from 'src/auth/entities/auth.entity';
import { httpResponse } from 'src/common/utils/http-response.util';
import { AddCategoryDto } from './dtos/add-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService
    ){}

    @Get('')
    @Auth()
    async list(
        @GetUser() user: UserEntity
    ){
        const res = await this.categoriesService.list(user);

        return httpResponse(res, 'Se listado la informacion correctamente.')
    }


    @Post()
    @Auth()
    async addCategory(
        @GetUser() user: UserEntity,
        @Body() addExpenseDto: AddCategoryDto
    ){
        const res = await this.categoriesService.add(addExpenseDto, user)

         return httpResponse(res, 'Se registro la categoria correctamente.')
    }


    @Patch(':id')
    @Auth()
    async updateCategory(
        @Body() addExpenseDto: AddCategoryDto,
        @Param('id') id: string,
    ){
        const res = await this.categoriesService.update(addExpenseDto, id)

        return httpResponse(res, 'Se registro la categoria correctamente.')
    }
}
