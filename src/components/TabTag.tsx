import { ReactElement, ReactNode, createElement, useMemo } from "react";
import classNames from "classnames";
import { BadgeDirectionEnum, BadgeStyleEnum, CaptionTypeEnum } from "../../typings/ControllableTabContainerProps";
import Badge from "./Badge";

type tabTagProps = {
    isCurrentTab: boolean;
    captionType: CaptionTypeEnum;
    captionText: string;
    captionHTML: string;
    captionContent: ReactNode;
    badgeStyle: BadgeStyleEnum;
    badgeText?: string;
    badgeDirection: BadgeDirectionEnum;
    onSelect: () => void;
    tabIndex: number | undefined;
};

function TabTag({
    isCurrentTab,
    captionType,
    captionContent,
    captionText,
    captionHTML,
    onSelect,
    badgeStyle,
    badgeText,
    badgeDirection,
    tabIndex
}: tabTagProps): ReactElement {
    const renderCaption = useMemo(
        (): ReactNode =>
            captionType === "text" ? (
                <span className="mx-text">{captionText}</span>
            ) : captionType === "html" ? (
                <span
                    dangerouslySetInnerHTML={{
                        __html: captionHTML
                    }}
                ></span>
            ) : (
                captionContent
            ),
        [captionText, captionHTML, captionContent, captionType]
    );

    return (
        <button
            className={classNames(`ctc-tab-tag ctc-badge-${badgeDirection}`, { active: isCurrentTab })}
            onClick={onSelect}
            tabIndex={tabIndex}
        >
            {renderCaption}
            <Badge style={badgeStyle} text={badgeText} />
        </button>
    );
}
export default TabTag;
