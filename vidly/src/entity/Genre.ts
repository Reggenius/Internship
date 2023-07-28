import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert, 
    BeforeUpdate } from "typeorm"
import { Movie } from "./Movie"

@Entity()
export class Genre {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 20,
        unique: true,
    })
    genres: string
    @BeforeInsert()
    @BeforeUpdate()
    trimWhitespace() {
        if(this.genres) {
            this.genres = this.genres.trim();
        }
    }

    @OneToMany(() => Movie, (movie) => movie.genre)
    movies: Movie[]
}