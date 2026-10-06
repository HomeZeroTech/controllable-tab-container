import { ReactElement, createElement, ReactNode, Fragment } from "react";
import NoTabContent from "./NoTabContent";

type tabContentProps = {
    currentTabIndex: number;
    tab: ReactNode | undefined;
    isLoading: boolean;
};

const Tab = ({ currentTabIndex, tab, isLoading }: tabContentProps): ReactElement =>
    tab ? (
        // Key on the index so switching tabs remounts the content instead of reusing another tab's state
        <div className={"ctc-tab"} key={currentTabIndex}>
            {tab}
        </div>
    ) : isLoading ? (
        <Fragment />
    ) : (
        <NoTabContent currentTabIndex={currentTabIndex} />
    );

export default Tab;
