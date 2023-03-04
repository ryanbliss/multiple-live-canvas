import { SharedMap } from "fluid-framework";
import { LiveState } from "@microsoft/live-share";

export const isSharedMap = (obj: any): obj is SharedMap => {
  if (!obj) return false;
  return obj instanceof SharedMap;
};

export const isLiveState = (obj: any): obj is LiveState => {
    if (!obj) return false;
    return obj instanceof LiveState;
  };

export const isErrorLike = (obj: any): obj is { message: string } => {
    return typeof obj?.message === "string";
}
