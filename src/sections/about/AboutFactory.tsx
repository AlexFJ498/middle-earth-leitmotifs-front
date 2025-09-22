import React from "react";
import { About } from "./About";

export class AboutFactory {
    static create(): React.ReactElement {
        return <About />;
    }
}
