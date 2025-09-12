import { faker } from "@faker-js/faker";

import { Movie } from "../src/domain/Movie";

export class MovieMother {
	static create(params?: Partial<Movie>): Movie {
		const defaultParams: Movie = {
			id: faker.string.uuid(),
			name: faker.word.sample(),
			...params,
		};

		return defaultParams;
	}
}
