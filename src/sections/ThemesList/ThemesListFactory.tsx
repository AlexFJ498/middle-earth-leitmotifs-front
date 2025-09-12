import React from "react";
import { ApiThemeRepository } from "../../infrastructure/ApiThemeRepository";
import { ThemesList } from "./ThemesList";

const repository = new ApiThemeRepository();

export class ThemesListFactory {
    static create(): React.ReactElement {
        return <ThemesList repository={repository} />;
    }
}
