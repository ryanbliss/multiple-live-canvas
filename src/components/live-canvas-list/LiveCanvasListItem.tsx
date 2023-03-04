import { FC, useEffect, useRef } from "react";
import { useLiveCanvas, useLiveShareContext } from "../../context";
import { FlexColumn } from "../flex";
import { InkingManager } from "@microsoft/live-share-canvas";
import { tokens } from "@fluentui/react-components";

interface ILiveCanvasListItemProps {
  canvasKey: string;
  onClick: () => void;
}

export const LiveCanvasListItem: FC<ILiveCanvasListItemProps> = ({
  canvasKey,
  onClick,
}) => {
  const { selectedCanvasKey } = useLiveShareContext();
  const liveCanvas = useLiveCanvas(canvasKey);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const inkingManagerRef = useRef<InkingManager>();

  useEffect(() => {
    if (!liveCanvas || !canvasRef.current) return;
    const initializeIfNeeded = async () => {
      if (!canvasRef.current) return;
      try {
        inkingManagerRef.current = new InkingManager(canvasRef.current);
        inkingManagerRef.current.scale = 0.25;
        inkingManagerRef.current.referencePoint = "center";
        await liveCanvas.initialize(inkingManagerRef.current);
      } catch (error: unknown) {
        console.error(error);
      }
    };
    initializeIfNeeded();
    return () => {
      liveCanvas.dispose();
      inkingManagerRef.current?.deactivate();
      inkingManagerRef.current?.removeAllListeners();
      inkingManagerRef.current = undefined;
      if (!canvasRef.current) return;
      while (canvasRef.current.firstChild) {
        if (canvasRef.current.lastChild) {
          canvasRef.current.removeChild(canvasRef.current.lastChild);
        }
      }
    };
    // selectedCanvasKey is in dependency array so that when the key changes, it will re-render the canvas, which helps re-draw local-user changes. This should be fixed in the future.
  }, [liveCanvas, selectedCanvasKey]);

  return (
    <FlexColumn
      style={{
        width: "256px",
        height: "180px",
        backgroundColor: tokens.colorNeutralBackground2,
      }}
    >
      <div
        ref={canvasRef}
        style={{
          width: "256px",
          height: "180px",
          position: "absolute",
          borderColor:
            selectedCanvasKey === canvasKey
              ? tokens.colorPaletteRedBorderActive
              : tokens.colorNeutralStroke1,
          borderWidth: "1px",
          borderStyle: "solid",
        }}
        onClick={onClick}
      />
    </FlexColumn>
  );
};
