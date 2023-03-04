import { app } from "@microsoft/teams-js";
import { createContext } from "react";

export interface ITeamsClientContext {
    teamsContext: app.Context | undefined;
}

export const TeamsClientContext = createContext<ITeamsClientContext>({} as ITeamsClientContext);
