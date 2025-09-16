import { useEffect, useState } from "react";
import { Theme } from "../../domain/Theme";
import { ThemeRepository } from "../../domain/ThemeRepository";

export function useTheme(
	repository: ThemeRepository,
	themeId: string
): {
	theme: Theme | null;
	isLoading: boolean;
} {
	const [theme, setTheme] = useState<Theme | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setIsLoading(true);
		repository.findById(themeId).then((data) => {
			setTheme(data);
			setIsLoading(false);
		});
	}, [repository, themeId]);

	return { theme, isLoading };
}
