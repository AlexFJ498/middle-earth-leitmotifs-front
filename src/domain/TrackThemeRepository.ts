import { TrackTheme } from "./TrackTheme";

export interface TrackThemeRepository {
	findByTrack(trackId: string): Promise<TrackTheme[]>;
}
