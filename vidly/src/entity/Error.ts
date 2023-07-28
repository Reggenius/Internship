import { Entity, Column, PrimaryGeneratedColumn, } from 'typeorm'

@Entity()
export class Errors {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 16
    })
    level: string

    @Column({
        length: 2048
    })
    message: string

    
    // @Column("json")
    // meta: JSON

    @Column("longtext")
    meta: JSON
    
    @Column("datetime")
    timestamp: Date
}