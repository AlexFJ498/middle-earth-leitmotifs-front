import React from "react";
import { ApiThemeRepository } from "../../infrastructure/ApiThemeRepository";
import { GroupsList } from "./GroupsList";

const repository = new ApiThemeRepository();

export class GroupsListFactory {
    static create(): React.ReactElement {
        return <GroupsList repository={repository} />;
    }
}
