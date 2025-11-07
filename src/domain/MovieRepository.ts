import { Movie } from "./Movie";

export interface MovieRepository {
	searchAll(): Promise<Movie[]>;
}
