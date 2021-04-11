import React, { useState } from "react";

interface HeadingListProps {
  items: string[];
  onChecked?: (item: string, idx: number, selected: boolean) => void;
  onSelect?: (item: string) => void;
}

export const HeadingList: React.FC<HeadingListProps> = ({
  items,
  onChecked,
  onSelect,
}) => {
  const [selected, setSelected] = useState<number | undefined>();
  return (
    <div
      style={{
        height: 500,
        width: 200,
        minHeight: 300,
        minWidth: 200,
        overflow: "scroll",
      }}
    >
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {items.map((item, idx) => (
          <li
            key={item}
            style={{
              background: idx === selected ? "red" : undefined,
            }}
            onClick={() => {
              setSelected(idx);
              onSelect?.(item);
            }}
          >
            <input
              type="checkbox"
              id={`item-${item}`}
              onChange={(event) => onChecked?.(item, idx, event.target.checked)}
              onClick={(event) => event.stopPropagation()}
            />
            <label>{item}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};
