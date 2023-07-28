import { Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    ManyToOne, 
    OneToMany, 
    JoinColumn } from "typeorm"
import { Genre } from "./Genre"
import { Rental } from "./Rental"

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 100,
        unique: true
    })
    title: string


    @Column()
    number_in_stock: number
        
    @Column("double")
    daily_rental_rate: number

    @ManyToOne(() => Genre, (genre) => genre.movies)
    @JoinColumn()
    genre: Genre

    @OneToMany(() => Rental, (rental) => rental.movie)
    rentals: Rental[]
}