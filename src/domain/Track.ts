import { Movie } from "./Movie";

export interface Track {
	id        : string;
	name      : string;
	movie     : Movie;
	spotifyURL: string | null;
}
