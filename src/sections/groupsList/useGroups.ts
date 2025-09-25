import { useEffect, useState } from "react";
import { Group } from "../../domain/Group";

import { GroupRepository } from "../../domain/GroupRepository";

export function useGroups(repository: GroupRepository): { groups: Group[]; isLoading: boolean } {
	const [groups, setGroups] = useState<Group[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		repository.searchAll().then((data) => {
			setGroups(data);
			setIsLoading(false);
		});
	}, [repository]);

	return { groups, isLoading };
}
