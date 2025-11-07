import { ApiMovieRepository } from "../../infrastructure/ApiMovieRepository";
import { ApiTrackRepository } from "../../infrastructure/ApiTrackRepository";
import { ApiTrackThemeRepository } from "../../infrastructure/ApiTrackThemeRepository";
import { Tracks } from "./Tracks";

const MovieRepository = new ApiMovieRepository();
const TrackRepository = new ApiTrackRepository();
const TrackThemeRepository = new ApiTrackThemeRepository();

export class TracksFactory {
	static create(): React.ReactElement {
		return <Tracks
			movieRepository={MovieRepository}
			trackRepository={TrackRepository}
			trackThemeRepository={TrackThemeRepository}
		/>;
	}
}
