import { useEffect, useState } from "react";
import { TrackTheme } from "../../domain/TrackTheme";
import { TrackThemeRepository } from "../../domain/TrackThemeRepository";

export function useTracksThemes(repository: TrackThemeRepository, trackId: string): { tracksThemes: TrackTheme[]; isLoadingThemes: boolean } {
	const [tracksThemes, setTracksThemes] = useState<TrackTheme[]>([]);
	const [isLoadingThemes, setIsLoadingThemes] = useState(true);

	useEffect(() => {
		if (!trackId) {
			setTracksThemes([]);
			setIsLoadingThemes(false);
			return;
		}
		
		setIsLoadingThemes(true);
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
				setIsLoadingThemes(false);
			});
	}, [repository, trackId]);
	return { tracksThemes, isLoadingThemes };
}
