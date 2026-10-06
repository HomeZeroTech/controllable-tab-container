import { ReactNode } from "react";
import { CaptionTypeEnum } from "./ControllableTabContainerProps";

export type Tab = {
    captionType: CaptionTypeEnum;
    captionText: string;
    captionHTML: string;
    captionContent: ReactNode;
    onSelect: () => void;
    badgeText?: string;
};
