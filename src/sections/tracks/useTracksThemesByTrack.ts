import { useEffect, useState } from "react";
import { TrackTheme } from "../../domain/TrackTheme";
import { TrackThemeRepository } from "../../domain/TrackThemeRepository";

export function useTracksThemesByTrack(repository: TrackThemeRepository, trackId: string): { tracksThemes: TrackTheme[]; isLoadingTrackThemesByTrack: boolean } {
	const [tracksThemes, setTracksThemes] = useState<TrackTheme[]>([]);
	const [isLoadingTrackThemesByTrack, setIsLoadingTrackThemesByTrack] = useState(true);

	useEffect(() => {
		if (!trackId) {
			setTracksThemes([]);
			setIsLoadingTrackThemesByTrack(false);
			return;
		}
		
		setIsLoadingTrackThemesByTrack(true);
		repository
			.findByTrack(trackId)
			.then((tracksThemes) => {
				setTracksThemes(tracksThemes);
			})
			.catch((err) => {
				console.error('Failed to fetch track themes:', err);
				setTracksThemes([]);
			})
			.finally(() => {
				setIsLoadingTrackThemesByTrack(false);
			});
	}, [repository, trackId]);
	return { tracksThemes, isLoadingTrackThemesByTrack };
}
