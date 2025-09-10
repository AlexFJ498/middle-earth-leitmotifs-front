import { Theme } from "./Theme";

export interface ThemeRepository {
    searchAll(): Promise<Theme[]>;
}