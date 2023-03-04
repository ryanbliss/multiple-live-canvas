import { Button, Spinner } from "@fluentui/react-components";
import { FC, useEffect, useRef } from "react";
import { useLiveCanvas, useLiveShareContext } from "../../context";
import { FlexColumn, FlexItem, FlexRow } from "../flex";
import { InkingManager, InkingTool } from "@microsoft/live-share-canvas";

export const LiveCanvasEditor: FC = () => {
  const { selectedCanvasKey } = useLiveShareContext();
  const liveCanvas = useLiveCanvas(selectedCanvasKey);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const inkingManagerRef = useRef<InkingManager>();

  useEffect(() => {
    if (!liveCanvas || !canvasRef.current) return;
    const initializeIfNeeded = async () => {
      if (!canvasRef.current) return;
      try {
        inkingManagerRef.current = new InkingManager(canvasRef.current);
        await liveCanvas.initialize(inkingManagerRef.current);
        inkingManagerRef.current.referencePoint = "center";
        inkingManagerRef.current.activate();
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
      if (!canvasRef.current) {
        return;
      }
      while (canvasRef.current.firstChild) {
        if (canvasRef.current.lastChild) {
            canvasRef.current.removeChild(canvasRef.current.lastChild);
        }
      }
    };
  }, [liveCanvas]);

  return (
    <FlexColumn fill="both">
      <div ref={canvasRef} style={{ height: "100%", width: "100%" }}>
        {!liveCanvas && selectedCanvasKey && <Spinner />}
        {!selectedCanvasKey && <h1>{"No canvas selected..."}</h1>}
      </div>
      <FlexItem noShrink>
        <FlexRow gap="small">
          <Button
            onClick={() => {
              if (!inkingManagerRef.current) return;
              inkingManagerRef.current.tool = InkingTool.pen;
            }}
          >
            {"Pen"}
          </Button>
          <Button
            onClick={() => {
              if (!inkingManagerRef.current) return;
              inkingManagerRef.current.tool = InkingTool.highlighter;
            }}
          >
            {"Highlight"}
          </Button>
        </FlexRow>
      </FlexItem>
    </FlexColumn>
  );
};
