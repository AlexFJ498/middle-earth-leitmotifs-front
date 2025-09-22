import { Group } from "../../domain/Group";
import { GroupRepository } from "../../domain/GroupRepository";
import { useEffect, useState } from "react";

export function useGroup(
	repository: GroupRepository,
	groupId: string
): {
	group: Group | null;
	isLoadingGroup: boolean;
} {
	const [group, setGroup] = useState<Group | null>(null);
	const [isLoadingGroup, setIsLoadingGroup] = useState<boolean>(true);

	useEffect(() => {
		setIsLoadingGroup(true);
		repository.findById(groupId).then((data) => {
			setGroup(data);
			setIsLoadingGroup(false);
		});
	}, [repository, groupId]);

	return { group, isLoadingGroup };
}
