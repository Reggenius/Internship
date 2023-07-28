import { AppDataSource } from "../data-source"

export default async function connectDB() {
        await AppDataSource.initialize()
        .then(() => console.log('Connected to MySQL...'))
}