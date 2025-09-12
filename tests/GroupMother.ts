import { faker } from "@faker-js/faker";

import { Group } from "../src/domain/Group";

export class GroupMother {
	static create(params?: Partial<Group>): Group {
		const defaultParams: Group = {
			id: faker.string.uuid(),
			name: faker.word.sample(),
			...params,
		};

		return defaultParams;
	}
}
