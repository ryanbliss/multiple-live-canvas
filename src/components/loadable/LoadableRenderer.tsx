import { Spinner } from "@fluentui/react-components";
import { FC, ReactNode } from "react";
import { FlexColumn } from "../flex";

interface ILoadableRendererProps {
  children?: ReactNode;
  loading: boolean;
  error?: Error;
}

export const LoadableRenderer: FC<ILoadableRendererProps> = (props) => {
  const { children, loading, error } = props;
  if (error) {
    return (
      <FlexColumn fill="both" vAlign="center" hAlign="center">
        {error.message}
      </FlexColumn>
    );
  }
  if (loading) {
    return (
      <FlexColumn fill="both" vAlign="center" hAlign="center">
        <Spinner />
      </FlexColumn>
    );
  }
  return <>{children}</>;
};
