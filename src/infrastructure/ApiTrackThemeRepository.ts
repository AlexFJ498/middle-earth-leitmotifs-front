import { TrackTheme } from "../domain/TrackTheme";
import { TracksThemesResponses } from "./ApiResponse";
import { toDomainTheme } from "./ApiThemeRepository";
import { toDomainTrack } from "./ApiTrackRepository";

export function toDomainTrackTheme(dto: TracksThemesResponses): TrackTheme {
	return {
		track: toDomainTrack(dto.track),
		theme: toDomainTheme(dto.theme),
		startSecond: dto.start_second,
		endSecond: dto.end_second,
		isVariant: dto.is_variant,
	};
}

export class ApiTrackThemeRepository {
	private readonly baseUrl = import.meta.env.VITE_API_URL;

	async findByTrack(trackId: string) {
		const response = await fetch(`${this.baseUrl}/tracks/${trackId}/themes`, {
			headers: { "Content-Type": "application/json" },
		});

		if (!response.ok) {
			throw new Error("Error fetching track themes");
		}
		
		const data: TracksThemesResponses[] = await response.json();
		return data.map(toDomainTrackTheme);
	}

	async findByTheme(themeId: string) {
		// Exceptional case: Sauron and The Evil of the Ring are essentially the same theme, but they need
		// to be treated differently in the Themes section. When fetching tracks for Sauron, we need to use
		// The Evil of the Ring's ID to actually get the tracks, so they don't get duplicated in the Tracks list.
		if (themeId === import.meta.env.THE_EVIL_OF_THE_RING_UUID) {
			themeId = import.meta.env.MORDOR_SAURON_UUID;
		}

		const response = await fetch(`${this.baseUrl}/themes/${themeId}/tracks`, {
			headers: { "Content-Type": "application/json" },
		});

		if (!response.ok) {
			throw new Error("Error fetching theme tracks");
		}

		const data: TracksThemesResponses[] = await response.json();
		return data.map(toDomainTrackTheme);
	}
}
