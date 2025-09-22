import { Theme } from "./Theme";

export interface ThemeRepository {
	searchAll(): Promise<Theme[]>;
	findById(id: string): Promise<Theme | null>;
	findByGroupId(groupId: string): Promise<Theme[]>;
}
