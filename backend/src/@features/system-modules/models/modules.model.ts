import { ACTION } from "../../actions/models/actions.model.js";

export interface IModule  {
    name: string;
    displayName: string;
    actions: ACTION[];
}