import { AppDataSource } from "../data-source"

export const getRepo = (Entity) => {
    return AppDataSource.getRepository(Entity);
}