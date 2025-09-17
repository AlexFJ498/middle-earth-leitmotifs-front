import { Group } from "../../domain/Group";
import { GroupRepository } from "../../domain/GroupRepository";
import { useEffect, useState } from "react";

export function useGroup(
	repository: GroupRepository,
	groupId: string
): {
	group: Group | null;
	isLoading: boolean;
} {
	const [group, setGroup] = useState<Group | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setIsLoading(true);
		repository.findById(groupId).then((data) => {
			setGroup(data);
			setIsLoading(false);
		});
	}, [repository, groupId]);

	return { group, isLoading };
}
