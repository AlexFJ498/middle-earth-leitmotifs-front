import { useEffect, useState } from "react";
import { Theme } from "../../domain/Theme";

import { ThemeRepository } from "../../domain/ThemeRepository";

export function useThemes(repository: ThemeRepository): { themes: Theme[]; isLoading: boolean } {
	const [themes, setThemes] = useState<Theme[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		repository.searchAll().then((data) => {
			setThemes(data);
			setIsLoading(false);
		});
	}, [repository]);

	return { themes, isLoading };
}
