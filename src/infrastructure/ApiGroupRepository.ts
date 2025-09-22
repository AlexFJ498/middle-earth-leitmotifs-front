import { Group } from "../domain/Group";
import { GroupRepository } from "../domain/GroupRepository";
import { GroupsResponses } from "./ApiResponse";

export function toDomainGroup(dto: GroupsResponses): Group {
	return {
		id         : dto.id,
		name       : dto.name,
		description: dto.description,
		imageUrl   : dto.image_url,
	};
}

export class ApiGroupRepository implements GroupRepository {
	private readonly baseUrl = import.meta.env.VITE_API_URL;

	async searchAll(): Promise<Group[]> {
		const response = await fetch(`${this.baseUrl}/groups`, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Error fetching groups");
		}

		const data: GroupsResponses[] = await response.json();

		return data.map(toDomainGroup);
	}

	async findById(id: string): Promise<Group | null> {
		const response = await fetch(`${this.baseUrl}/groups/${id}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		
		if (response.status === 404) {
			return null;
		}

		if (!response.ok) {
			throw new Error("Error fetching group");
		}

		const data: GroupsResponses = await response.json();

		return toDomainGroup(data);
	}
}
