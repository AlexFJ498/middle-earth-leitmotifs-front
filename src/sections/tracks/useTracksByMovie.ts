import { useEffect, useState } from "react";
import { Track } from "../../domain/Track";
import { TrackRepository } from "../../domain/TrackRepository";


export function useTracksByMovie(repository: TrackRepository, movieId: string): { tracks: Track[]; isLoadingTracksByMovie: boolean } {
	const [tracks, setTracks] = useState<Track[]>([]);
	const [isLoadingTracksByMovie, setIsLoadingTracksByMovie] = useState(true);

	useEffect(() => {
		if (!movieId) {
			setTracks([]);
			setIsLoadingTracksByMovie(false);
			return;
		}
		
		setIsLoadingTracksByMovie(true);
		repository
			.findByMovieId(movieId)
			.then((data) => {
				setTracks(data);
			})
			.catch((err) => {
				setTracks([]);
			})
			.finally(() => {
				setIsLoadingTracksByMovie(false);
			});
	}, [repository, movieId]);

	return { tracks, isLoadingTracksByMovie };
}
