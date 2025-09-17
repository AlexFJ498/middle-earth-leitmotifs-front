import React from "react";
import { ApiThemeRepository } from "../../infrastructure/ApiThemeRepository";
import { GroupDetail } from "./GroupDetail";

const repository = new ApiThemeRepository();

export class GroupDetailFactory {
    static create(): React.ReactElement {
        return <GroupDetail repository={repository} />;
    }
}
