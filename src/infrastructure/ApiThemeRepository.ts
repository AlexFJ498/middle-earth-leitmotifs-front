import { ThemesResponses } from "./ApiResponse";

export class ApiThemeRepository {
    private readonly baseUrl = import.meta.env.VITE_API_URL;

    async searchAll(): Promise<ThemesResponses[]> {
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