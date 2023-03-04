import { useCallback } from "react";
import { useLiveShareContext } from "./LiveShareProvider";
import { LiveCanvas } from "@microsoft/live-share-canvas";

export const useCreateNewLiveCanvas = () => {
  const { canvasMap, container } = useLiveShareContext();
  return useCallback(async (): Promise<void> => {
    if (!canvasMap || !container) {
        throw new Error("Container not yet created");
    }
    const newCanvas = await container.create(LiveCanvas);
    canvasMap.set(newCanvas.id, newCanvas.handle);
  }, [canvasMap, container]);
};
