import {
  FC,
  useEffect,
  CSSProperties,
  useState,
  ReactNode,
} from "react";
import { Theme } from "./themes";
import {
  teamsLightTheme as fwcLightTheme,
  teamsDarkTheme as fwcDarkTheme,
  teamsHighContrastTheme as fwcHighContrastTheme,
  FluentProvider,
  Theme as FluentTheme,
} from "@fluentui/react-components";
import { app } from "@microsoft/teams-js";
import { useTeamsClientContext } from "../../context";
import { inTeams } from "../../utils";

export const UIProvider: FC<{
  children: ReactNode;
  style?: CSSProperties;
  overrideTheme?: Theme;
  overrideFluentTheme?: FluentTheme;
}> = ({ children, style, overrideFluentTheme }) => {
  const [fluentTheme, setFluentTheme] = useState(
    overrideFluentTheme ?? fwcLightTheme
  );

  const { teamsContext } = useTeamsClientContext();

  useEffect(() => {
    const themeChangeHandler = (theme: string | undefined) => {
      switch (theme) {
        case "dark":
          setFluentTheme(fwcDarkTheme);
          break;
        case "contrast":
          setFluentTheme(fwcHighContrastTheme);
          break;
        case "default":
        default:
          setFluentTheme(fwcLightTheme);
      }
    };
    themeChangeHandler(teamsContext?.app.theme);
    if (inTeams()) {
      app.registerOnThemeChangeHandler(themeChangeHandler);
    }
  }, [teamsContext?.app.theme]);

  return (
    <FluentProvider
      theme={overrideFluentTheme ?? fluentTheme}
      style={
        style ?? {
          backgroundColor: "transparent",
        }
      }
    >
      {children}
    </FluentProvider>
  );
};
