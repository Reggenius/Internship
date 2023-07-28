import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 50
    })
    name: string

    @Column({
        unique: true,
        length: 255
    })
    email: string

    @Column({
        length: 1024
    })
    password: string

    @Column()
    isAdmin: boolean

}
