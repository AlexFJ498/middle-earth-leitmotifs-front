import React from "react";
import { ApiGroupRepository } from "../../infrastructure/ApiGroupRepository";
import { ApiThemeRepository } from "../../infrastructure/ApiThemeRepository";
import { GroupDetail } from "./GroupDetail";

const groupRepository = new ApiGroupRepository();
const themeRepository = new ApiThemeRepository();

export class GroupDetailFactory {
    static create(): React.ReactElement {
		return <GroupDetail groupRepository={groupRepository} themeRepository={themeRepository} />;
    }
}
