import { Track } from "../domain/Track";
import { TracksResponses } from "./ApiResponse";

export function toDomainTrack(dto: TracksResponses): Track {
	return {
		id        : dto.id,
		name      : dto.name,
		movie     : dto.movie,
		spotifyURL: dto.spotify_url,
	};
}

export class ApiTrackRepository {
	private readonly baseUrl = import.meta.env.VITE_API_URL;

	async findByMovieId(id: string): Promise<Track[]> {
		const response = await fetch(`${this.baseUrl}/movies/${id}/tracks`, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Error fetching tracks");
		}

		const data: TracksResponses[] = await response.json();

		return data.map(toDomainTrack);
	}
}
