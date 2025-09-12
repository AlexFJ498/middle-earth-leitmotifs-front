import { Theme } from "../domain/Theme";
import { ThemeRepository } from "../domain/ThemeRepository";
import { ThemesResponses } from "./ApiResponse";

export class ApiThemeRepository implements ThemeRepository {
	private readonly baseUrl = import.meta.env.VITE_API_URL;

	async searchAll(): Promise<Theme[]> {
		const response = await fetch(`${this.baseUrl}/themes`, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Error fetching themesº");
		}

		const data = await response.json();

		return data as ThemesResponses[];
	}
}
