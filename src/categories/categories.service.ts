import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/entities/auth.entity';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { HttpExceptionWM } from 'src/common/exceptions/http.exception';
import { ExceptionEnum } from 'src/common/enum/exception.enum';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>
    ){}

    async list(user: UserEntity){
        const categories = await this.categoryRepository.find({
            where: {
                usuario: user
            },
            order: {
                'id': 'DESC'
            }
        })

        return categories;

    }

    async add(request, user){
        const newCategory = this.categoryRepository.create({
            name: request.name,
            color: this.generarColorHexClaro(),
            usuario: user
        })

        return await this.categoryRepository.save(newCategory)
    }

    async update(request, id){
        const category = await this.categoryRepository.findOne({ where: { id } });

        if (!category) {
            throw new HttpExceptionWM({
            statusCode: 404,
            type: ExceptionEnum.NOT_FOUND,
            message: 'Categoría no encontrada',
            });
        }

        category.name = request.name ?? category.name;

        return await this.categoryRepository.save(category);
    }

    generarColorHexClaro(): string {
        const r = Math.floor(200 + Math.random() * 55); // 200–255
        const g = Math.floor(200 + Math.random() * 55);
        const b = Math.floor(200 + Math.random() * 55);

        return (
            '#' +
            r.toString(16).padStart(2, '0') +
            g.toString(16).padStart(2, '0') +
            b.toString(16).padStart(2, '0')
        );
    }
}
