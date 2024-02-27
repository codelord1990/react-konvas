import React, { useState, useEffect } from "react";
import { Group, Rect } from "react-konva";
import { EditableText } from "./EditableText.js";

export function StickyNote({
  colour,
  text,
  x,
  y,
  width,
  height,
  onClick,
  onTextResize,
  onTextChange,
  selected,
  onTextClick
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

  const [groupX, setGroupX] = React.useState(100);
  const [groupY, setGroupY] = React.useState(100);

  const handleDragMove = (e) => {
    // Update the x and y position of the Group based on the drag movement
    setGroupX(e.target.x());
    setGroupY(e.target.y());
  };

  useEffect(() => {
    if (!selected && isEditing) {
      setIsEditing(false);
    } else if (!selected && isTransforming) {
      setIsTransforming(false);
    }
  }, [selected, isEditing, isTransforming]);

  function toggleEdit() {
    setIsEditing(!isEditing);
    onTextClick(!isEditing);
  }

  function toggleTransforming() {
    setIsTransforming(!isTransforming);
    onTextClick(!isTransforming);
  }

  return (
    <Group x={x} y={y}  
      draggable
      onDragMove={handleDragMove}>
      <Rect
        x={20}
        y={20}
        width={width}
        height={height + 40}
        fill={colour}
        shadowColor="black"
        shadowOffsetY={10}
        shadowOffsetX={0}
        shadowBlur={30}
        shadowOpacity={0.6}
        perfectDrawEnabled={false}
      />
      <Rect
        x={0}
        y={0}
        width={width + 40}
        height={height + 60}
        fill={colour}
        perfectDrawEnabled={false}
        onClick={onClick}
        onTap={onClick}
      />
      <EditableText
        x={20}
        y={40}
        text={text}
        width={width}
        height={height}
        onResize={onTextResize}
        isEditing={isEditing}
        isTransforming={isTransforming}
        onToggleEdit={toggleEdit}
        onToggleTransform={toggleTransforming}
        onChange={onTextChange}
      />
    </Group>
  );
}
