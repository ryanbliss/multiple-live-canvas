import { FC, ReactNode, useEffect, useRef, useState, useContext } from "react";
import { TeamsClientContext, ITeamsClientContext } from "./internals";
import {
  app,
  FrameContexts,
  HostClientType,
  HostName,
} from "@microsoft/teams-js";
import { inTeams } from "../../utils";

interface ITeamsClientProviderProps {
  children?: ReactNode;
}

export const TeamsClientProvider: FC<ITeamsClientProviderProps> = ({
  children,
}) => {
  const { teamsContext } = useTeamsContext();

  return (
    <TeamsClientContext.Provider
      value={{
        teamsContext,
      }}
    >
      {children}
    </TeamsClientContext.Provider>
  );
};

/**
 * Uses context provided by TeamsClientContext wrapper
 */
export const useTeamsClientContext = (): ITeamsClientContext =>
  useContext(TeamsClientContext);

/**
 * Fetches context from Teams
 */
const useTeamsContext = (): {
  teamsContext: app.Context | undefined;
} => {
  const isInitializingRef = useRef<boolean>(false);
  const [teamsContext, setTeamsContext] = useState<app.Context | undefined>();

  useEffect(() => {
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;
    if (!inTeams()) {
      setTeamsContext(createFakeContext());
      return;
    }
    let mounted = true;
    // initialize teams-js
    const initializeTeamsJs = async () => {
      try {
        await app.initialize();
      } catch (error: unknown) {
        console.error(error);
      }
      // get teams-js context
      try {
        const context = await app.getContext();

        if (!context) {
          throw new Error("Invalid context object");
        }
        if (!context.page.frameContext) {
          throw new Error("No frame context found in Teams context");
        }
        // Notify Teams that app was successfully initialized
        app.notifySuccess();
        if (!mounted) return;
        setTeamsContext(context);
      } catch (error: unknown) {
        console.error(error);
      }
    };
    initializeTeamsJs();
    return () => {
      mounted = false;
    };
  }, [setTeamsContext]);

  return {
    teamsContext,
  };
};

const createFakeContext = (): app.Context => {
  const fakeHost: app.AppHostInfo = {
    name: HostName.teams,
    clientType: HostClientType.web,
    sessionId: "",
  };

  const fakeAppInfo: app.AppInfo = {
    locale: "",
    theme: "",
    sessionId: "",
    host: fakeHost,
  };

  const fakePageInfo: app.PageInfo = {
    id: "",
    frameContext: FrameContexts.meetingStage,
  };

  const fakeUserInfo: app.UserInfo = {
    id: `user${Math.abs(Math.random() * 999999999)}`,
  };

  const fakeContext: app.Context = {
    app: fakeAppInfo,
    page: fakePageInfo,
    user: fakeUserInfo,
  };

  return fakeContext;
};
