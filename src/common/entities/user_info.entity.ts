import { UserEntity } from "src/auth/entities/auth.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity('user_info')
export class UserInfoEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column('decimal',{default: 0})
    salary: number;

    @Column('decimal', {default: 0})
    saving:number

    @OneToOne(
        () => UserEntity,
        (user) => user
    )
    @JoinColumn()
    user: UserEntity
}