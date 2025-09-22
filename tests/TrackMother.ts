import { faker } from "@faker-js/faker";

import { Track } from "../src/domain/Track";
import { MovieMother } from "./MovieMother";

export class TrackMother {
	static create(params?: Partial<Track>): Track {
		const defaultParams: Track = {
			id: faker.string.uuid(),
			name: faker.word.sample(),
			movie: MovieMother.create(),
			spotifyURL: null,
				
			...params,
		};

		return defaultParams;
	}
}
