import { useEffect, useState } from "react";

import { ThemeRepository } from "../../domain/ThemeRepository";
import { ThemesResponses } from "../../infrastructure/ApiResponse";

export function useThemes(repository: ThemeRepository): { themes: ThemesResponses[]; isLoading: boolean } {
	const [themes, setThemes] = useState<ThemesResponses[]>([]);
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
