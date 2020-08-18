import React from "react";

interface HeadingListProps {
  items: string[];
}

export const HeadingList = (props: HeadingListProps) => {
  return (
    <div
      style={{
        height: 300,
        width: 200,
        minHeight: 300,
        minWidth: 200,
        overflow: "scroll",
      }}
    >
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {props.items.map((item) => (
          <li key={item}>
            <input type="checkbox" id={`item-${item}`} />
            <label htmlFor={`item-${item}`}>{item}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};
