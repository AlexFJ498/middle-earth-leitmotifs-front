import { Group } from "./Group";

export interface GroupRepository {
	searchAll(): Promise<Group[]>;
	findById(id: string): Promise<Group | null>;
}
