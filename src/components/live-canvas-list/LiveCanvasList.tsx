import { Button } from "@fluentui/react-components";
import { useCreateNewLiveCanvas, useLiveShareContext } from "../../context";
import { FlexColumn, FlexItem, FlexRow } from "../flex";
import { LiveCanvasListItem } from "./LiveCanvasListItem";

export const LiveCanvasList = () => {
  const { canvasKeys, liveSelectedCanvas } = useLiveShareContext();
  const createNewLiveCanvas = useCreateNewLiveCanvas();

  return (
    <FlexColumn fill="view-height" scroll>
      <FlexItem noShrink>
        <FlexRow>
          <Button onClick={createNewLiveCanvas}>{"Create New Canvas"}</Button>
        </FlexRow>
      </FlexItem>
      <FlexColumn scroll fill="both" style={{ position: "relative"}}>
        {canvasKeys.map((canvasKey) => (
          <FlexItem noShrink key={canvasKey}>
            <LiveCanvasListItem
              canvasKey={canvasKey}
              onClick={() => {
                liveSelectedCanvas?.changeState(canvasKey);
              }}
            />
          </FlexItem>
        ))}
      </FlexColumn>
    </FlexColumn>
  );
};
