import { Theme } from "../domain/Theme";
import { ThemeRepository } from "../domain/ThemeRepository";
import { ThemesResponses } from "./ApiResponse";

function toDomainTheme(dto: ThemesResponses): Theme {
  return {
    id: dto.id,
    name: dto.name,
    firstHeard: dto.first_heard,
    group: dto.group,
    category: dto.category,
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
}
