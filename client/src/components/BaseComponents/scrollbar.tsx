import React, { useEffect, useRef, useState } from "react";
import Measure from "react-measure";
import { Scrollbars, ScrollbarProps } from "react-custom-scrollbars";

type IScrollbarProps = ScrollbarProps & { children: any };

const Scrollbar = (props: IScrollbarProps) => {
  const ScrollbarsRef = useRef<any>(null);

  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      console.log("FORCING HEIGHT");
      ScrollbarsRef.current?.forceUpdate();
    }, 1000);
  });
  return (
    <Scrollbars
      ref={ScrollbarsRef}
      style={{ ...props.style, height: 300, maxHeight: 300 }}
      {...props}
    >
      <Measure
        bounds
        onResize={contentRect => {
          console.log(contentRect.bounds);
          setContentHeight(contentRect.bounds?.height ?? 0);
        }}
      >
        {({ measureRef }) => <div ref={measureRef}>{props.children}</div>}
      </Measure>
    </Scrollbars>
  );
};

export default Scrollbar;
