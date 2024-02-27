import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Star, Text, Line } from "react-konva";

const ST_RECTANGLE = "rectangle";
const ST_LINE = "line";

const App = () => {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const historyRef = useRef([[]]);
  const status = useRef(ST_LINE);

  const handleMouseDown = (e) => {
    if (!isDraggable) {
      isDrawing.current = true;
      switch (status) {
        case ST_RECTANGLE: 
          //
          break;
        case ST_LINE:
          //
          console.log('line')
          
    
          break;

        default:
          break;
      }
      const { x, y } = e.target.getStage().getPointerPosition();
      setLines([...lines, { points: [x, y, x, y] }]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDraggable && lines.length > 0) {
      if (!isDrawing.current) {
        return;
      }
      const { x, y } = e.target.getStage().getPointerPosition();
      let lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.slice();
      lastLine.points[2] = x;
      lastLine.points[3] = y;

      setLines([...lines.slice(0, lines.length - 1), lastLine]);
    }
  };

  const handleMouseUp = () => {
    if (!isDraggable) {
      isDrawing.current = false
      
      historyRef.current.push(lines);
      console.log(historyRef.current)
    // setLines([]);
      // save line
    }
  };

  const toggleDraggable = () => {
    setIsDraggable(!isDraggable);
  };

  const clearDrawing = () => {
    console.log(lines)
    // historyRef.current = [...historyRef.current, lines];
    setLines([]);
  };

  const undoLine = () => {
    if (historyRef.current.length > 0) {
      console.log(historyRef.current)
      setLines(historyRef.current[historyRef.current.length - 1]);
      historyRef.current = historyRef.current.slice(0, -1);
    }
  };

  return (
    <div>
      <button onClick={toggleDraggable}>
        {isDraggable ? "Disable Draggable" : "Enable Draggable"}
      </button>

      <button onClick={clearDrawing}>Clear Dragging</button>
      <button onClick={undoLine}>Undo Dragging</button>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="black"
              strokeWidth={6}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                isDraggable ? "source-over" : "destination-over"
              }
              draggable={isDraggable}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
