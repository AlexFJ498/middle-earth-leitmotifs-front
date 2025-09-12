import React from "react";
import { ApiThemeRepository } from "../../infrastructure/ApiThemeRepository";
import { ThemeDetail } from "./ThemeDetail";

const repository = new ApiThemeRepository();

export class ThemeDetailFactory {
    static create(): React.ReactElement {
        return <ThemeDetail repository={repository} />;
    }
}
