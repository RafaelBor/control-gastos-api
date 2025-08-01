import { UserEntity } from "src/auth/entities/auth.entity";
import { ExpenseEntity } from "src/expenses/entities/expenses.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('categories')
export class CategoryEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column('varchar')
    name: string

    @Column('varchar')
    color: string

    @Column('varchar', {
        default: ''
    })
    icon: string

    @ManyToOne(
        () => UserEntity,
        (usuario) => usuario.categories
    )
    usuario: UserEntity

     @OneToMany(
        () => ExpenseEntity,
        (expense) => expense.category,
    )
    expenses: ExpenseEntity[]

    
}