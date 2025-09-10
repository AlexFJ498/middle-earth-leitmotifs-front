import { faker } from "@faker-js/faker";
import { Theme } from "../src/domain/Theme";
import { TrackMother } from "./TrackMother";
import { GroupMother } from "./GroupMother";
import { CategoryMother } from "./CategoryMother";

export class ThemeMother {
    static create(params?: Partial<Theme>): Theme {
        const defaultParams: Theme = {
            id: faker.string.uuid(),
            name: faker.word.sample(),
            firstHeard: TrackMother.create(),
            group: GroupMother.create(),
            category: CategoryMother.create(),
            ...params
        }

        return defaultParams;
    }
}