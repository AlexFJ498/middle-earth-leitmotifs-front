import { faker } from "@faker-js/faker";

import { Group } from "../src/domain/Group";

export class GroupMother {
	static create(params?: Partial<Group>): Group {
		const defaultParams: Group = {
			id: faker.string.uuid(),
			name: faker.word.sample(),
			description: faker.lorem.paragraphs({ min: 1, max: 3 }),
			imageUrl: faker.image.urlLoremFlickr({ category: "nature", width: 640, height: 480 }),
			...params,
		};

		return defaultParams;
	}
}
