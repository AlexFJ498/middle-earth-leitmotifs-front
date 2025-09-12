import { useEffect, useState } from "react";
import { Theme } from "../../domain/Theme";
import { ThemeRepository } from "../../domain/ThemeRepository";

export function useTheme(
	repository: ThemeRepository,
	themeId: string
): {
	theme: Theme | null;
} {
	const [theme, setTheme] = useState<Theme | null>(null);

	useEffect(() => {
		repository.findById(themeId).then((data) => {
			setTheme(data);
		});
	}, [repository, themeId]);

	return { theme };
}
