import classNames from "classnames";
import { useId, useState } from "react";

import "./Tabs.scss";

interface TabDefinition {
  render: () => React.ReactNode;
  title: React.ReactNode;
}

interface TabsProps {
  containerClassName?: string;
  panelClassName?: string;
  defaultIndex?: number;
  tabs: ReadonlyArray<TabDefinition>;
}

export default function Tabs(props: TabsProps) {
  const {containerClassName, panelClassName, defaultIndex = 0, tabs} = props;

  const id = useId();
  const [selectedTabIndex, setSelectedTabIndex] = useState(defaultIndex);

  return (
    <div className={containerClassName}>
      <div className="widgets-Tabs_tablist" role="tablist">
        {tabs.map((tab, tabIndex) => (
          <button
            key={tabIndex}
            id={`${id}-tab-${tabIndex}`}
            role="tab"
            aria-selected={tabIndex === selectedTabIndex ? "true" : "false"}
            tabIndex={tabIndex === selectedTabIndex ? 0 : -1}
            aria-controls={`${id}-tabpanel-${tabIndex}`}
            onClick={() => setSelectedTabIndex(tabIndex)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      {tabs.map((tab, tabIndex) => (
        <div
          key={tabIndex}
          id={`${id}-tabpanel-${tabIndex}`}
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`${id}-tab-${tabIndex}`}
          hidden={tabIndex !== selectedTabIndex}
          className={panelClassName}
        >
          {tab.render()}
        </div>
      ))}
    </div>
  );
}

function FlexTabs(props: TabsProps) {
  const {containerClassName, panelClassName, ...restProps} = props;

  return (
    <Tabs
      containerClassName={classNames("flex-item-fill h-100 flex-container-column", containerClassName)}
      panelClassName={classNames("h-100 overflow-y-scroll", panelClassName)}
      {...restProps}
    />
  )
}

Tabs.Flex = FlexTabs;
