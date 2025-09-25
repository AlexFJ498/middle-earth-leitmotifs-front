import React from "react";
import { ApiGroupRepository } from "../../infrastructure/ApiGroupRepository";
import { GroupsList } from "./GroupsList";

const repository = new ApiGroupRepository();

export class GroupsListFactory {
    static create(): React.ReactElement {
        return <GroupsList repository={repository} />;
    }
}
