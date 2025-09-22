import { faker } from "@faker-js/faker";

import { Theme } from "../src/domain/Theme";
import { CategoryMother } from "./CategoryMother";
import { GroupMother } from "./GroupMother";
import { TrackMother } from "./TrackMother";

export class ThemeMother {
	static create(params?: Partial<Theme>): Theme {
		const defaultParams: Theme = {
			id: faker.string.uuid(),
			name: faker.word.sample(),
			firstHeard: TrackMother.create(),
			group: GroupMother.create(),
			category: CategoryMother.create(),
			description: faker.lorem.paragraphs({ min: 1, max: 3 }),
			...params,
		};

		return defaultParams;
	}
}
