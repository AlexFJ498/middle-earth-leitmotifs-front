import React from "react";
import { ApiThemeRepository } from "../../infrastructure/ApiThemeRepository";
import { About } from "./About";

const repository = new ApiThemeRepository();

export class AboutFactory {
    static create(): React.ReactElement {
        return <About />;
    }
}
