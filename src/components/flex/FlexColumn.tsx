import { FC } from "react";
import { mergeClasses } from "@fluentui/react-components";
import { FlexOptions, getFlexColumnStyles } from "./flex-styles";

export interface IFlexColumnOptions extends FlexOptions {
  /** Unique property for styles for Side Panel or Tab content */
  isSidePanel?: boolean;
  scroll?: boolean;
}

export const FlexColumn: FC<IFlexColumnOptions> = (props) => {
  const {
    children,
    // Merged classes from parent
    className,
    fill,
    gap,
    hAlign,
    name,
    role,
    scroll,
    spaceBetween,
    transparent,
    style,
    vAlign,
  } = props;
  const flexColumnStyles = getFlexColumnStyles();

  const isHidden = role === "presentation";

  const mergedClasses = mergeClasses(
    flexColumnStyles.root,
    fill === "both" && flexColumnStyles.fill,
    fill === "height" && flexColumnStyles.fillH,
    fill === "view" && flexColumnStyles.fillV,
    fill === "view-height" && flexColumnStyles.fillVH,
    fill === "width" && flexColumnStyles.fillW,
    gap && flexColumnStyles.gapReset,
    gap === "smaller" && flexColumnStyles.gapSmaller,
    gap === "small" && flexColumnStyles.gapSmall,
    gap === "medium" && flexColumnStyles.gapMedium,
    gap === "large" && flexColumnStyles.gapLarge,
    hAlign === "center" && flexColumnStyles.hAlignCenter,
    hAlign === "end" && flexColumnStyles.hAlignEnd,
    hAlign === "start" && flexColumnStyles.hAlignStart,
    isHidden && flexColumnStyles.defaultCursor,
    isHidden && flexColumnStyles.pointerEvents,
    scroll && flexColumnStyles.scroll,
    spaceBetween && flexColumnStyles.spaceBetween,
    transparent && flexColumnStyles.transparent,
    vAlign === "center" && flexColumnStyles.vAlignCenter,
    vAlign === "end" && flexColumnStyles.vAlignEnd,
    vAlign === "start" && flexColumnStyles.vAlignStart,
    className && className,
  );

  return (
    <div
      aria-hidden={isHidden}
      data-name={!!name ? name : undefined}
      className={mergedClasses}
      role={role && role}
      style={style}
      tabIndex={isHidden ? -1 : 0}
    >
      {children}
    </div>
  );
};
