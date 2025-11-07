export interface MoviesResponses {
	id  : string;
	name: string;
}

export interface GroupsResponses {
	id         : string;
	name       : string;
	description: string;
	image_url  : string;
}

interface CategoriesResponses {
	id  : string;
	name: string;
}

export interface TracksResponses {
	id         : string;
	name       : string;
	movie      : MoviesResponses;
	spotify_url: string | null;
}

export interface ThemesResponses {
	id               : string;
	name             : string;
	first_heard      : TracksResponses;
	group            : GroupsResponses;
	description      : string;
	first_heard_start: number;
	first_heard_end  : number;
	category         : CategoriesResponses;
}

export interface TracksThemesResponses {
	track      : TracksResponses;
	theme      : ThemesResponses;
	start_second: number;
	end_second  : number;
	is_variant  : boolean;
}
