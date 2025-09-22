import { useEffect, useState } from "react";
import { Theme } from "../../domain/Theme";

import { ThemeRepository } from "../../domain/ThemeRepository";

export function useThemesByGroup(repository: ThemeRepository, groupId: string): { themes: Theme[]; isLoadingThemesByGroup: boolean } {
	const [themes, setThemes] = useState<Theme[]>([]);
	const [isLoadingThemesByGroup, setIsLoadingThemesByGroup] = useState(true);

	useEffect(() => {
		setIsLoadingThemesByGroup(true);
		repository.findByGroupId(groupId).then((data) => {
			setThemes(data);
			setIsLoadingThemesByGroup(false);
		});
	}, [repository, groupId]);

	return { themes, isLoadingThemesByGroup };
}
