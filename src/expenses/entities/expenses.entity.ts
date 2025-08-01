import { Transform } from "class-transformer";
import { UserEntity } from "src/auth/entities/auth.entity";
import { CategoryEntity } from "src/categories/entities/category.entity";
import { MonthEntity } from "src/month/entities/month.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('expenses')
export class ExpenseEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column('date')
    date: Date;

    @Column('numeric')
    @Transform(({ value }) => Number(value))
    expense: number

    @Column('uuid')
    monthId: string;

    @Column('varchar',{
        default: ''
    })
    detail?: string

    @Column('uuid')
    categoryId: string;

    @ManyToOne(
        () => UserEntity,
        (usuario) => usuario.months,
        { eager: true }
    )
    usuario: UserEntity

    @ManyToOne(
        () => MonthEntity,
        (month) => month.id,
        { eager: true }
    )
    month: MonthEntity

    @ManyToOne(
        () => CategoryEntity,
        (category) => category.expenses,
        { eager: true }
    )
    category: CategoryEntity
}