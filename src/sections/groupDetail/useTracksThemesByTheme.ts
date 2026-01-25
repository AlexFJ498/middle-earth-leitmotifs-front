import { useState, useCallback } from "react";
import { TrackTheme } from "../../domain/TrackTheme";
import { TrackThemeRepository } from "../../domain/TrackThemeRepository";

interface ThemeTracksState {
	data: TrackTheme[];
	isLoading: boolean;
	hasLoaded: boolean;
}

export function useTracksThemesByTheme(repository: TrackThemeRepository) {
	const [tracksMap, setTracksMap] = useState<Map<string, ThemeTracksState>>(new Map());

	const loadTracksForTheme = useCallback(
		(themeId: string) => {
			const existing = tracksMap.get(themeId);
			if (existing?.hasLoaded || existing?.isLoading) {
				return;
			}

			setTracksMap((prev) => {
				const next = new Map(prev);
				next.set(themeId, { data: [], isLoading: true, hasLoaded: false });
				return next;
			});

			repository
				.findByTheme(themeId)
				.then((tracks) => {
					setTracksMap((prev) => {
						const next = new Map(prev);
						next.set(themeId, { data: tracks, isLoading: false, hasLoaded: true });
						return next;
					});
				})
				.catch((err) => {
					console.error(`Failed to fetch tracks for theme ${themeId}:`, err);
					setTracksMap((prev) => {
						const next = new Map(prev);
						next.set(themeId, { data: [], isLoading: false, hasLoaded: true });
						return next;
					});
				});
		},
		[repository, tracksMap]
	);

	const getTracksForTheme = useCallback(
		(themeId: string): ThemeTracksState => {
			return tracksMap.get(themeId) ?? { data: [], isLoading: false, hasLoaded: false };
		},
		[tracksMap]
	);

	return { loadTracksForTheme, getTracksForTheme };
}
