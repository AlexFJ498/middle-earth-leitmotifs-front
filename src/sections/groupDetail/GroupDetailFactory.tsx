import React from "react";
import { ApiGroupRepository } from "../../infrastructure/ApiGroupRepository";
import { ApiThemeRepository } from "../../infrastructure/ApiThemeRepository";
import { ApiTrackThemeRepository } from "../../infrastructure/ApiTrackThemeRepository";
import { GroupDetail } from "./GroupDetail";

const groupRepository = new ApiGroupRepository();
const themeRepository = new ApiThemeRepository();
const trackThemeRepository = new ApiTrackThemeRepository();

export class GroupDetailFactory {
    static create(): React.ReactElement {
		return <GroupDetail groupRepository={groupRepository} themeRepository={themeRepository} trackThemeRepository={trackThemeRepository} />;
    }
}
