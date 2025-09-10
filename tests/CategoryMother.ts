import { faker } from "@faker-js/faker";
import { Category } from "../src/domain/Category";

export class CategoryMother {
    static create(params?: Partial<Category>): Category {
        const defaultParams: Category = {
            id: faker.string.uuid(),
            name: faker.word.sample(),
            ...params
        };
        return defaultParams;
    }
}