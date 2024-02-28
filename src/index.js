import React, { useState, useRef } from "react";
import { render } from "react-dom";
import { Stage, Layer, Rect, Line, Text, Group, Transformer } from "react-konva";
import { StickyNote } from "./StickyNote";

const ST_RECTANGLE = "rectangle";
const ST_LINE = "line";
const ST_VERTICAL_LINE = "vertical";
const ST_HORIZONTAL_LINE = "horizontal";

const App = () => {
  // const [text, setText] = useState("Click to resize. Double click to edit.");
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [selected, setSelected] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const [shapes, setShapes] = useState([]);
  const isDrawing = useRef(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const status = useRef(ST_LINE);
  const history = useRef([]);
  const [fibonacciLines, setFibonacciLines] = useState([]);

  const [texts, setTexts] = useState({}); // Initialize texts array with 10 empty strings

  // Function to handle text change for a specific StickyNote
  const handleTextChange = (index, value) => {
    const updatedTexts = {...texts};
    updatedTexts[index] = value;
    setTexts(updatedTexts);
  };

  const handleDeselect = () => {
    setIsSelected(false);
  };

  const handleMouseDown = (e) => {
    if (!isDraggable) {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();

      switch (status.current) {
        case ST_RECTANGLE:
          setShapes([...shapes, { type: ST_RECTANGLE, points: [pos.x, pos.y, 0, 0] }]);
          break;
        case ST_LINE:
          setShapes([...shapes, { type: ST_LINE, points: [pos.x, pos.y, pos.x, pos.y] }]);
          break;
        case ST_VERTICAL_LINE:
          setShapes([...shapes, { type: ST_VERTICAL_LINE, points: [pos.x, pos.y, pos.x, pos.y] }]);
          break;
        case ST_HORIZONTAL_LINE:
          setShapes([...shapes, { type: ST_HORIZONTAL_LINE, points: [pos.x, pos.y, pos.x, pos.y] }]);
        break;
        default:
          break;
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDraggable && shapes.length > 0 && isDrawing.current) {
      const pos = e.target.getStage().getPointerPosition();
      let newShape = shapes[shapes.length - 1];
      newShape.points = newShape.points.slice();

      switch (newShape.type) {
        case ST_RECTANGLE:
          newShape.points[2] = pos.x - newShape.points[0];
          newShape.points[3] = pos.y - newShape.points[1];
          break;
        case ST_LINE:
          newShape.points[2] = pos.x;
          newShape.points[3] = pos.y;
          break;
        case ST_VERTICAL_LINE:
          newShape.points[2] = newShape.points[0];
          newShape.points[3] = pos.y;
          break;
        case ST_HORIZONTAL_LINE:
        newShape.points[2] = pos.x;;
        newShape.points[3] = newShape.points[1];
        break;

        default:
          break;
      }

      setShapes([...shapes.slice(0, shapes.length - 1), newShape]);
    }
  };

  const handleMouseUp = () => {
    if (!isDraggable) {
      isDrawing.current = false;
      history.current = [...history.current, shapes];
    }
  };

  const toggleDraggable = () => {
    setIsDraggable(!isDraggable);
  };

  const clearDrawing = () => {
    setShapes([]);
  };

  const undoDrawing = () => {
    if (history.current.length > 0) {
      history.current.pop();
      setShapes(history.current[history.current.length - 1] || []);
    }
  };

  const setRectangle = () => {
    status.current = ST_RECTANGLE;
  };

  const setLine = () => {
    status.current = ST_LINE;
  };

  const setVerticalLine = () => {
    status.current = ST_VERTICAL_LINE;
  };

  const setHorizontalLine = () => {
    status.current = ST_HORIZONTAL_LINE;
  };

  const calculateFibonacci = () => {
    if (shapes.length === 0) return;

    const minPoint = Math.min(...shapes.map(shape => Math.min(...shape.points)));
    const maxPoint = Math.max(...shapes.map(shape => Math.max(...shape.points)));
    const diff = maxPoint - minPoint;

    setFibonacciLines([
      { pos: minPoint, ratio: '0.0' },
      { pos: minPoint + diff * 0.236, ratio: '23.6' },
      { pos: minPoint + diff * 0.382, ratio: '38.2' },
      { pos: minPoint + diff * 0.5, ratio: '50.0' },
      { pos: minPoint + diff * 0.618, ratio: '61.8' },
      { pos: maxPoint, ratio: '100.0' },
    ]);
  };

  return (
    <div>
      <button onClick={setLine}>Line</button>
      <button onClick={setRectangle}>Rectangle</button>
      <button onClick={setVerticalLine}>Vertical Line</button>
      <button onClick={setHorizontalLine}>Horizontal Line</button>
      <button onClick={toggleDraggable}>
        {isDraggable ? "Disable Draggable" : "Enable Draggable"}
      </button>
      <button onClick={undoDrawing}>Undo</button>
      <button onClick={clearDrawing}>Clear Drawing</button>
      <button onClick={calculateFibonacci}>Calculate Fibonacci</button>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {shapes.map((shape, i) => (
            shape.type === ST_RECTANGLE ?
              <StickyNote
                x={shape.points[0]}
                y={shape.points[1]}
                text={texts[i] || 'Default Text'}
                colour="#FFDAE1"
                onTextChange={(value) => handleTextChange(i, value)}
                width={width}
                height={height}
                selected={selected}
                draggable={isDraggable}
                onTextResize={(newWidth, newHeight) => {
                  setWidth(newWidth);
                  setHeight(newHeight);
                }}
                onClick={() => {
                  setSelected(!selected);
                }}
                onTextClick={(newSelected) => {
                  setSelected(newSelected);
                }}
              />
              :
              <Line
                key={i}
                points={shape.points}
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
          {fibonacciLines.map((line, i) => (
            <>
              <Line
                key={i}
                points={[0, line.pos, window.innerWidth, line.pos]}
                stroke="red"
                strokeWidth={2}
                draggable={isDraggable}
              />
              <Text
                text={`${line.ratio}%`}
                y={line.pos}
                fill='red'
              />
            </>
          ))}
        </Layer>
      </Stage>
    </div>
  
  );
};

render(<App />, document.getElementById("root"));