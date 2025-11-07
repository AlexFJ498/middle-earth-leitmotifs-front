import { useEffect, useState } from "react";
import { Movie } from "../../domain/Movie";
import { MovieRepository } from "../../domain/MovieRepository";

export function useMovies(repository: MovieRepository): { movies: Movie[]; isLoadingMovies: boolean } {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [isLoadingMovies, setIsLoadingMovies] = useState(true);

	useEffect(() => {
		setIsLoadingMovies(true);
		repository.searchAll().then((data) => {
			setMovies(data);
			setIsLoadingMovies(false);
		});
	}, [repository]);

	return { movies, isLoadingMovies };
}
