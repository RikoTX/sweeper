import { useState, useEffect } from "react";
import "./App.css";
import Timer from "./components/Timer.tsx";

const ROWS = 10;
const COLS = 10;
const BOMBS = 10;

type Cell = {
  isBomb: boolean;
  isRevealed: boolean;
  value: number;
};

function generateField(): Cell[] {
  const field: Cell[] = Array.from({ length: ROWS * COLS }, () => ({
    isBomb: false,
    isRevealed: false,
    value: 0,
  }));

  let placed = 0;
  while (placed < BOMBS) {
    const index = Math.floor(Math.random() * ROWS * COLS);
    if (!field[index].isBomb) {
      field[index].isBomb = true;
      placed++;
    }
  }

  for (let i = 0; i < ROWS * COLS; i++) {
    if (field[i].isBomb) continue;

    const row = Math.floor(i / COLS);
    const col = i % COLS;
    let count = 0;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
          const neighborIndex = r * COLS + c;
          if (field[neighborIndex].isBomb) count++;
        }
      }
    }

    field[i].value = count;
  }

  return field;
}

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [field, setField] = useState<Cell[]>(generateField);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  useEffect(() => {
    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  const getImageSrc = (): string => {
    if (isPressed) return "./wow.png";
    if (hasWon) return "./cools.png";
    if (gameOver) return "./dead.png";
    return "./smile1.png";
  };
  function winAlert() {
    alert("ты выйгарал, за столько секунд: " + document.querySelector(".timer")?.textContent);
  }
  const getImageStyle = (): React.CSSProperties => {
    return isPressed ? { width: "45px", padding: "20px" } : { width: "90px" };
  };
  const revealZeros = (newField: Cell[], index: number) => {
    const queue: number[] = [index];
    const visited = new Set<number>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      const row = Math.floor(current / COLS);
      const col = current % COLS;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const r = row + dr;
          const c = col + dc;
          if (
            r >= 0 &&
            r < ROWS &&
            c >= 0 &&
            c < COLS &&
            !(dr === 0 && dc === 0)
          ) {
            const neighborIndex = r * COLS + c;
            const neighbor = newField[neighborIndex];

            if (!neighbor.isRevealed && !neighbor.isBomb) {
              neighbor.isRevealed = true;

              if (neighbor.value === 0 && !visited.has(neighborIndex)) {
                queue.push(neighborIndex);
                visited.add(neighborIndex);
              }
            }
          }
        }
      }
    }
  };

  const checkWin = (field: Cell[]) => {
    const unrevealed = field.filter((cell) => !cell.isRevealed);
    return unrevealed.length === BOMBS;
  };

  const handleCellClick = (index: number) => {
    if (!hasStarted) setHasStarted(true);
    if (gameOver || hasWon) return;

    const newField = [...field];
    const cell = newField[index];

    if (cell.isRevealed) return;

    cell.isRevealed = true;

    if (cell.isBomb) {
      setGameOver(true);
      setHasStarted(false);
      newField.forEach((c) => (c.isRevealed = true));
    } else {
      if (cell.value === 0) {
        revealZeros(newField, index);
      }

      if (checkWin(newField)) {
        setHasWon(true);
        setHasStarted(false);
        newField.forEach((c) => (c.isRevealed = true));
        setTimeout(function(){ winAlert()},100);
      }
    }

    setField(newField);
  };

  const restartGame = () => {
    setHasStarted(false);
    setGameOver(false);
    setHasWon(false);
    setTimerKey((prev) => prev + 1);
    setField(generateField());
  };

  return (
    <div className="container">
      <div className="containerHeader">
        <div>
          <button className="restartButton" onClick={restartGame}>
            <img src={getImageSrc()} alt="smile" style={getImageStyle()} />
          </button>
        </div>
        <div>
          <Timer key={timerKey} start={hasStarted} />
        </div>
      </div>

      <div className="grid">
        {field.map((cell, i) => (
          <div
            key={i}
            className={`cell ${
              cell.isRevealed ? (cell.isBomb ? "bomb" : "safe") : ""
            }`}
            onClick={() => handleCellClick(i)}
          >
            {cell.isRevealed && !cell.isBomb && cell.value > 0
              ? cell.value
              : ""}
            {cell.isRevealed && cell.isBomb ? <img src="./bomba.png" alt="" style={{width:'30px'}}/> : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
