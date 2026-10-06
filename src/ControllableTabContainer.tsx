import { ReactElement, createElement, useState, useEffect, Fragment, useMemo, ReactNode } from "react";
import { ControllableTabContainerContainerProps, TabListType } from "../typings/ControllableTabContainerProps";
import classNames from "classnames";
import { ValueStatus } from "mendix";
import TabTags from "./components/TabTags";
import TabContent from "./components/TabContent";
import "./ui/ControllableTabContainer.css";
import Big from "big.js";
import { Tab } from "typings/General";

const sortTabList = (a: TabListType, b: TabListType): number => {
    if (a.sort.value !== undefined && b.sort.value !== undefined) {
        const tabA = parseFloat(a.sort.value.toFixed(0));
        const tabB = parseFloat(b.sort.value.toFixed(0));
        return tabA - tabB;
    } else {
        return 0;
    }
};

export function ControllableTabContainer({
    defaultTabIndex,
    tabListType,
    badgeStyle,
    tabList,
    datasource,
    captionTypeDynamic,
    captionTextDynamic,
    captionHTMLDynamic,
    captionContentDynamic,
    contentDynamic,
    onTabClickDynamic,
    badgeTextDynamic,
    badgeDirection,
    direction,
    disableTabChangeDynamic,
    name,
    style,
    tabIndex,
    class: className
}: ControllableTabContainerContainerProps): ReactElement {
    // Undefined while the expression is still loading - Number(undefined) would give NaN
    const defaultIndex: number | undefined =
        defaultTabIndex.value !== undefined ? Number(defaultTabIndex.value) : undefined;
    const [selectedTabIndex, setSelectedTabIndex] = useState<number | undefined>(defaultIndex);
    // Fall back to the default until the effect below has synced it into state
    const currentTabIndex: number | undefined = selectedTabIndex ?? defaultIndex;

    // In static mode the tab list depends on expressions that are still loading on the first render
    // (React client), which would otherwise briefly show the "No content found" message
    const isLoading: boolean =
        defaultTabIndex.status === ValueStatus.Loading ||
        (tabListType === "dynamic"
            ? datasource.status === ValueStatus.Loading
            : tabList.some(
                  tab => tab.visible.status === ValueStatus.Loading || tab.sort.status === ValueStatus.Loading
              ));

    const tabListAdjusted: TabListType[] = useMemo(
        () =>
            tabListType === "static"
                ? tabList.filter(tab => tab.visible.value === true).sort(sortTabList)
                : datasource.items
                ? datasource.items?.map((objItem, index): TabListType => {
                      return {
                          captionType: captionTypeDynamic,
                          captionText:
                              captionTextDynamic !== undefined
                                  ? captionTextDynamic.get(objItem)
                                  : { status: ValueStatus.Available, value: "" },
                          captionHTML:
                              captionHTMLDynamic !== undefined
                                  ? captionHTMLDynamic.get(objItem)
                                  : { status: ValueStatus.Available, value: "" },
                          captionContent: captionContentDynamic ? (
                              (captionContentDynamic.get(objItem) as ReactNode)
                          ) : (
                              <Fragment />
                          ),
                          content: contentDynamic.get(objItem) as ReactNode,
                          sort: { status: ValueStatus.Available, value: new Big(index) },
                          visible: { status: ValueStatus.Available, value: true },
                          badgeText: badgeTextDynamic?.get(objItem),
                          onTabClick: onTabClickDynamic?.get(objItem),
                          disableTabChange: disableTabChangeDynamic
                      };
                  })
                : [],
        [
            tabList,
            datasource,
            badgeTextDynamic,
            captionContentDynamic,
            captionHTMLDynamic,
            captionTextDynamic,
            captionTypeDynamic,
            contentDynamic,
            disableTabChangeDynamic,
            onTabClickDynamic,
            tabListType
        ]
    );

    const currentTab: ReactNode | undefined = useMemo(
        () => (currentTabIndex !== undefined ? tabListAdjusted[currentTabIndex]?.content : undefined),
        [currentTabIndex, tabListAdjusted]
    );

    // Handles if the current tab changes outside the widget - Set the Index
    useEffect(() => {
        if (defaultIndex !== undefined) {
            setSelectedTabIndex(defaultIndex);
        }
    }, [defaultIndex]);

    // Event for when a different tab is clicked
    const handleTabClick = (tab: TabListType, index: number): void => {
        tab.onTabClick?.execute();
        if (!tab.disableTabChange) {
            setSelectedTabIndex(index);
        }
    };

    return (
        <div id={name} className={classNames(`ctc ctc-${direction}`, className)} style={style}>
            <TabTags
                tabList={tabListAdjusted.map((tab, index): Tab => {
                    return {
                        captionType: tab.captionType,
                        captionText: tab.captionText.value ?? "",
                        captionHTML: tab.captionHTML.value ?? "",
                        captionContent: tab.captionContent,
                        badgeText: tab.badgeText?.value,
                        onSelect: () => handleTabClick(tab, index)
                    };
                })}
                currentTabIndex={currentTabIndex ?? -1}
                badgeStyle={badgeStyle}
                badgeDirection={badgeDirection}
                tabIndex={tabIndex}
            />
            <TabContent
                currentTabIndex={currentTabIndex ?? -1}
                tab={currentTab}
                isLoading={isLoading || currentTabIndex === undefined}
            />
        </div>
    );
}
