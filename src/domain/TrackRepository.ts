import { Track } from "./Track";

export interface TrackRepository {
	findByMovieId(id: string): Promise<Track[]>;
}
