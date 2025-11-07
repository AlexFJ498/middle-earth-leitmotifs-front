import { Movie } from "../domain/Movie";
import { MovieRepository } from "../domain/MovieRepository";
import { MoviesResponses } from "./ApiResponse";

export function toDomainMovie(dto: MoviesResponses): Movie {
	return {
		id         : dto.id,
		name       : dto.name,
	};
}

export class ApiMovieRepository implements MovieRepository {
	private readonly baseUrl = import.meta.env.VITE_API_URL;

	async searchAll(): Promise<Movie[]> {
		const response = await fetch(`${this.baseUrl}/movies`, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Error fetching movies");
		}

		const data: MoviesResponses[] = await response.json();

		return data.map(toDomainMovie);
	}
}
