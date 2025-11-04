import { Theme } from "../domain/Theme";
import { ThemeRepository } from "../domain/ThemeRepository";
import { toDomainGroup } from "./ApiGroupRepository";
import { ThemesResponses } from "./ApiResponse";
import { toDomainTrack } from "./ApiTrackRepository";

function toDomainTheme(dto: ThemesResponses): Theme {
	return {
		id             : dto.id,
		name           : dto.name,
		firstHeard     : toDomainTrack(dto.first_heard),
		group          : toDomainGroup(dto.group),
		description    : dto.description,
		firstHeardStart: dto.first_heard_start,
		firstHeardEnd  : dto.first_heard_end,
		category       : dto.category,
	};
}

export class ApiThemeRepository implements ThemeRepository {
	private readonly baseUrl = import.meta.env.VITE_API_URL;

	async searchAll(): Promise<Theme[]> {
		const response = await fetch(`${this.baseUrl}/themes`, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Error fetching themes");
		}

		const data: ThemesResponses[] = await response.json();

		return data.map(toDomainTheme);
	}

	async findById(id: string): Promise<Theme | null> {
		const response = await fetch(`${this.baseUrl}/themes/${id}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.status === 404) {
			return null;
		}

		if (!response.ok) {
			throw new Error("Error fetching theme");
		}

		const data: ThemesResponses = await response.json();

		return toDomainTheme(data);
	}

	async findByGroupId(groupId: string): Promise<Theme[]> {
		const response = await fetch(`${this.baseUrl}/groups/${groupId}/themes`, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Error fetching themes by group");
		}

		const data: ThemesResponses[] = await response.json();

		return data.map(toDomainTheme);
	}
}
