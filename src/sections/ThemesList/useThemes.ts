import { useEffect, useState } from "react";
import { ThemesResponses } from "../../infrastructure/ApiResponse";
import { ThemeRepository } from "../../domain/ThemeRepository";

export function useThemes(
    repository: ThemeRepository
):  { themes: ThemesResponses[] } {
    const [themes, setThemes] = useState<ThemesResponses[]>([]);

    useEffect(() => {
        repository.searchAll().then((data) => {
            setThemes(data);
        });
    }, [repository]);

    return { themes };
}