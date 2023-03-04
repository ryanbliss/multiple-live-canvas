import { FC } from "react";
import { mergeClasses } from "@fluentui/react-components";
import { FlexOptions, getFlexRowStyles } from "./flex-styles";

export interface IFlexRowOptions extends FlexOptions {
  wrap?: boolean;
  columnOnSmallScreen?: boolean;
}

export const FlexRow: FC<IFlexRowOptions> = (props) => {
  const {
    children,
    // Merged classes from parent
    className,
    columnOnSmallScreen,
    fill,
    gap,
    hAlign,
    name,
    role,
    spaceBetween,
    style,
    transparent,
    vAlign,
    wrap,
  } = props;

  const flexRowStyles = getFlexRowStyles();

  const isHidden = role === "presentation";

  const mergedClasses = mergeClasses(
    flexRowStyles.root,
    fill === "both" && flexRowStyles.fill,
    fill === "height" && flexRowStyles.fillH,
    fill === "view" && flexRowStyles.fillV,
    fill === "view-height" && flexRowStyles.fillVH,
    fill === "width" && flexRowStyles.fillW,
    gap === "smaller" && flexRowStyles.gapSmaller,
    gap === "small" && flexRowStyles.gapSmall,
    gap === "medium" && flexRowStyles.gapMedium,
    gap === "large" && flexRowStyles.gapLarge,
    hAlign === "center" && flexRowStyles.hAlignCenter,
    hAlign === "end" && flexRowStyles.hAlignEnd,
    hAlign === "start" && flexRowStyles.hAlignStart,
    isHidden && flexRowStyles.defaultCursor,
    isHidden && flexRowStyles.pointerEvents,
    spaceBetween && flexRowStyles.spaceBetween,
    transparent && flexRowStyles.transparent,
    vAlign === "center" && flexRowStyles.vAlignCenter,
    vAlign === "end" && flexRowStyles.vAlignEnd,
    vAlign === "start" && flexRowStyles.vAlignStart,
    wrap && flexRowStyles.wrap,
    columnOnSmallScreen && flexRowStyles.columnOnSmallScreen,
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
