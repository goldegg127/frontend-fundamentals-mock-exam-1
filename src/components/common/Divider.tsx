import React from 'react';
import { Border, Spacing } from 'tosslib';

interface DividerProps {
  borderHeight: number;
  spacingHeight: number;
}

const Divider = React.memo(({ borderHeight, spacingHeight }: DividerProps) => {
  return (
    <>
      <Spacing size={spacingHeight} />
      <Border height={borderHeight} />
      <Spacing size={spacingHeight} />
    </>
  );
});

export default Divider;
