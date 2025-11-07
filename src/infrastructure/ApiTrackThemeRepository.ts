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
}
