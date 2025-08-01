import { UserEntity } from "src/auth/entities/auth.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('months')
export class MonthEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column('date')
    date_month: Date;

    @Column('numeric')
    salary_montly: number

    @Column('numeric')
    savings_montly: number

    @Column('numeric', {
        default: 0
    })
    expenses_montly: number

    @ManyToOne(
        () => UserEntity,
        (usuario) => usuario.months
    )
    usuario: UserEntity

}