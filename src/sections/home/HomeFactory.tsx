import React from "react";
import { Home } from "./Home";

export class HomeFactory {
    static create(): React.ReactElement {
        return <Home />;
    }
}
