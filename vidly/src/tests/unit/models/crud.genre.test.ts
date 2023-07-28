import { validateGenre } from '../../../crud/genre'

describe('validate user genre input', () => {
    it('should return an error object', () => {
        let genre = { name: "a" }
        
        const result = validateGenre(genre);

        expect(result.error).toBeDefined();
    });
})

describe('validate user genre input', () => {
        it('should return an undefined error object', () => {
            let genre = { name: "aaaaa" }
            const result = validateGenre(genre);
    
            expect(result.error).toBeUndefined();
        })
})