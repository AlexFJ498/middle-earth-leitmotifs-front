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
    firstHeard: Tracks;
    group: Groups;
    category: Categories;
}