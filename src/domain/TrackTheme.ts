import { Theme } from "./Theme";
import { Track } from "./Track";

export interface TrackTheme {
	track      : Track;
	theme      : Theme;
	startSecond: number;
	endSecond  : number;
	isVariant  : boolean;
}
