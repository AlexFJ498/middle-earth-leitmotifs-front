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
