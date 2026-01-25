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
		
		let cancelled = false;
		
		setIsLoadingTrackThemesByTrack(true);
		repository
			.findByTrack(trackId)
			.then((tracksThemes) => {
				if (!cancelled) {
					setTracksThemes(tracksThemes);
				}
			})
			.catch((err) => {
				if (!cancelled) {
					setTracksThemes([]);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setIsLoadingTrackThemesByTrack(false);
				}
			});
		
		return () => {
			cancelled = true;
		};
	}, [repository, trackId]);
	return { tracksThemes, isLoadingTrackThemesByTrack };
}
