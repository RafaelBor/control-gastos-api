import { CategoryEntity } from "src/categories/entities/category.entity";
import { MonthEntity } from "src/month/entities/month.entity";
import { UserInfoEntity } from "src/common/entities/user_info.entity";
import { ExpenseEntity } from "src/expenses/entities/expenses.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EmailVerificationEntity } from "./email-verification.entity";

@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column('text',{
        unique:true,
    })
    email:string

    @Column('text',{
        unique:true
    })
    name:string

    @Column('text',{
        unique:true
    })
    lastname:string

    @Column('text',{
        select: false
    })
    password:string

    @Column('boolean', {
        default: false
    })
    verified: boolean;

    @OneToMany(
        () => CategoryEntity,
        (category) => category.usuario,
        {cascade: true}
    )
    categories: CategoryEntity[]

    @OneToOne(
        () => UserInfoEntity,
        (userInfo) => userInfo.user,
        { cascade: true }
    )
    userInfo: UserInfoEntity

    @OneToMany(
        () => MonthEntity,
        (month) => month.usuario
    )
    months: MonthEntity[]

    @OneToMany(
        () => ExpenseEntity,
        (expense) => expense.usuario
    )
    expenses: ExpenseEntity[]

    @OneToMany(
        () => EmailVerificationEntity,
        (verification) => verification.user,
    )
    emailVerifications: EmailVerificationEntity[];


    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert()
    }


}
