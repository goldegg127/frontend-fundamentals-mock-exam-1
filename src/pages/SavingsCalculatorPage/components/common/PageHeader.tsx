import React from 'react';
import { NavigationBar } from 'tosslib';

interface PageHeaderProps {
  title: string;
}

const PageHeader = React.memo(({ title }: PageHeaderProps) => {
  return <NavigationBar title={title} />;
});

export default PageHeader;
