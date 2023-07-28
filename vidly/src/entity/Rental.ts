import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Movie } from './Movie';
import { Customer } from './Customer';

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  customerId: number;

  @Column({ nullable: true })
  movieId: number;

  @Column()
  date_out: Date;

  @Column({ nullable: true })
  date_returned: Date;

  @Column({ nullable: true })
  rental_fee: number;

  // @ManyToOne(() => Customer, (customer) => customer.rentals)
  // @JoinColumn({ name: 'customerId' })
  // customer: Customer;

  // @ManyToOne(() => Movie, (movie) => movie.rentals)
  // @JoinColumn({ name: 'movieId' })
  // movie: Movie;

  @ManyToOne(() => Customer, (customer) => customer.rentals)
  @JoinColumn()
  customer: Customer

  @ManyToOne(() => Movie, (movie) => movie.rentals)
  @JoinColumn()
  movie: Movie
}





// import { 
//     Entity, 
//     CreateDateColumn,
//     Column, 
//     PrimaryGeneratedColumn,
//     ManyToOne,
//     JoinColumn
// } from "typeorm"
// import { Movie } from "./Movie"
// import { Customer } from "./Customer"

// @Entity()
// export class Rental {
//     @PrimaryGeneratedColumn()
//     id: number

//     @ManyToOne(() => Customer, (customer) => customer.rentals)
//     @JoinColumn()
//     customer: Customer

//     @ManyToOne(() => Movie, (movie) => movie.rentals)
//     @JoinColumn()
//     movie: Movie

//     @CreateDateColumn()
//       date_out: Date

//     @Column({
//       nullable: true
//     })
//     date_returned: Date

//     @Column({
//       type: "double",
//       nullable: true,
//       unsigned: true
//     })
//     rental_fee: number
// }