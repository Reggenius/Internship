import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Rental } from "./Rental"

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 50, })
    name: string

    @Column({ length: 15 })
    phone: string

    @Column({
        type: 'boolean',
        default: false
    })
    isGold: boolean

    @OneToMany(() => Rental, (rental) => rental.customer)
    rentals: Rental[]
}
