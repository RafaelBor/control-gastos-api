import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column('text',{
        unique:true,
    })
    email:string

    @Column('text',{
        unique:true
    })
    nombre:string

    @Column('text',{
        unique:true
    })
    apellidos:string

    @Column('text',{
        select: false
    })
    password:string

    @Column('text',{
        default: 'admin'
    })
    role:string


    // @OneToMany(
    //     () => Cliente,
    //     (cliente) => cliente.usuario
    // )
    // cliente: Cliente


    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert()
    }


}
