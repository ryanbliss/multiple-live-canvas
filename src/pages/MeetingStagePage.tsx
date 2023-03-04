import { FC, memo } from "react";
import {
  FlexColumn,
  FlexItem,
  FlexRow,
  LiveCanvasEditor,
  LiveCanvasList,
  LoadableRenderer,
} from "../components";
import { LiveShareProvider, useTeamsClientContext } from "../context";

export const MeetingStagePage: FC = memo(() => {
  const { teamsContext } = useTeamsClientContext();
  return (
    <FlexColumn fill="view-height">
      <LoadableRenderer loading={!teamsContext}>
        <LiveShareProvider>
          <FlexRow fill="both">
            <FlexItem noShrink>
                <LiveCanvasList />
            </FlexItem>
            <LiveCanvasEditor />
          </FlexRow>
        </LiveShareProvider>
      </LoadableRenderer>
    </FlexColumn>
  );
});
