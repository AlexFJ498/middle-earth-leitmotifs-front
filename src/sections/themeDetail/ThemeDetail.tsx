import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ThemeRepository } from "../../domain/ThemeRepository";
import { useTheme } from "./useTheme";

export function ThemeDetail({ repository }: { readonly repository: ThemeRepository }) {
	const { id } = useParams() as { id: string };
	const themeId = useMemo(() => id, [id]);
	const { theme } = useTheme(repository, themeId);

	if (theme === null) {
		return <div>No theme found</div>;
	}

	return <div>{theme.name}</div>;
}
