import { Category } from "./Category";
import { Group } from "./Group";
import { Track } from "./Track";

export interface Theme {
    id: string;
    name: string;
    firstHeard: Track;
    group: Group;
    category: Category;
}