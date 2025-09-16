interface Movies {
	id: string;
	name: string;
}

interface Groups {
	id: string;
	name: string;
}

interface Categories {
	id: string;
	name: string;
}

interface Tracks {
	id: string;
	name: string;
	movie: Movies;
}

export interface ThemesResponses {
	id: string;
	name: string;
	first_heard: Tracks;
	group: Groups;
	category: Categories;
}
