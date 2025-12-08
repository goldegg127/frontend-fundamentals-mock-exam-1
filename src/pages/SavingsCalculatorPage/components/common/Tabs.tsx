import React, { useState, ReactElement } from 'react';
import { Tab } from 'tosslib';

interface TabPanelProps {
  label: string; // 탭 표시 텍스트
  value: string; // 탭 식별자
  children: React.ReactNode; // 탭 내용
}

interface TabsProps {
  children: ReactElement<TabPanelProps> | Array<ReactElement<TabPanelProps>>;
  defaultValue?: string; // 초기 선택 탭
}

const TabPanel = ({ children }: TabPanelProps) => {
  return <>{children}</>;
};

const TabsMain = React.memo(({ children, defaultValue }: TabsProps) => {
  const panels = React.Children.toArray(children) as Array<ReactElement<TabPanelProps>>;

  const [activeTabValue, setActiveTabValue] = useState(defaultValue || panels[0]?.props.value);

  const activePanel = panels.find(panel => panel.props.value === activeTabValue);

  return (
    <>
      {/* 탭 버튼 */}
      <Tab onChange={setActiveTabValue}>
        {panels.map(panel => (
          <Tab.Item key={panel.props.value} value={panel.props.value} selected={panel.props.value === activeTabValue}>
            {panel.props.label}
          </Tab.Item>
        ))}
      </Tab>

      {/* 활성화된 패널의 내용(children) */}
      {activePanel}
    </>
  );
});

const Tabs = Object.assign(TabsMain, {
  Panel: TabPanel,
});

export default Tabs;
