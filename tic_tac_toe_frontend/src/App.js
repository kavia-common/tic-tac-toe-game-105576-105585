import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * Ocean Professional Theme tokens used across the app.
 */
const theme = {
  primary: '#2563EB',   // blue
  secondary: '#F59E0B', // amber - used for success accents
  success: '#F59E0B',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
};

/**
 * Utility: calculates winner or tie.
 * Returns: { winner: 'X'|'O'|null, line: [a,b,c]|null, isTie: boolean }
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c], isTie: false };
    }
  }
  const isTie = squares.every((s) => s);
  return { winner: null, line: null, isTie };
}

/**
 * Square Component
 */
// PUBLIC_INTERFACE
function Square({ value, onClick, highlight, index }) {
  /** A square in the grid with accessible labeling. */
  return (
    <button
      className={`ttt-square ${highlight ? 'ttt-square--highlight' : ''}`}
      onClick={onClick}
      aria-label={`Cell ${index + 1}, ${value ? value : 'empty'}`}
    >
      <span className={`ttt-mark ${value === 'X' ? 'ttt-mark--x' : 'ttt-mark--o'}`}>
        {value}
      </span>
    </button>
  );
}

/**
 * Board Component
 */
// PUBLIC_INTERFACE
function Board({ squares, winningLine, onSquareClick }) {
  /** 3x3 grid board rendering squares. */
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {squares.map((val, idx) => {
        const highlight = winningLine ? winningLine.includes(idx) : false;
        return (
          <Square
            key={idx}
            index={idx}
            value={val}
            highlight={highlight}
            onClick={() => onSquareClick(idx)}
          />
        );
      })}
    </div>
  );
}

/**
 * StatusBar Component
 */
// PUBLIC_INTERFACE
function StatusBar({ currentPlayer, winner, isTie }) {
  /**
   * Displays game status: whose turn, win or tie message with themed badges.
   */
  if (winner) {
    return (
      <div className="ttt-status">
        <div className="ttt-badge ttt-badge--success" role="status" aria-live="polite">
          Player {winner} wins!
        </div>
      </div>
    );
  }
  if (isTie) {
    return (
      <div className="ttt-status">
        <div className="ttt-badge ttt-badge--warning" role="status" aria-live="polite">
          It&apos;s a tie!
        </div>
      </div>
    );
  }
  return (
    <div className="ttt-status">
      <div className="ttt-badge ttt-badge--info" role="status" aria-live="polite">
        Turn: Player {currentPlayer}
      </div>
    </div>
  );
}

/**
 * Controls Component (Restart)
 */
// PUBLIC_INTERFACE
function Controls({ onRestart, disabled }) {
  /** Restart button below the grid. */
  return (
    <div className="ttt-controls">
      <button
        className="ttt-btn"
        style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
        }}
        onClick={onRestart}
        disabled={disabled}
      >
        Restart Game
      </button>
    </div>
  );
}

/**
 * Scoreboard Component (Simple - counts session wins)
 */
// PUBLIC_INTERFACE
function Scoreboard({ xWins, oWins }) {
  /** Displays a simple scoreboard for the current session. */
  return (
    <div className="ttt-scoreboard" aria-label="Scoreboard">
      <div className="ttt-score ttt-score--x">
        <span className="ttt-score-label">X</span>
        <span className="ttt-score-value">{xWins}</span>
      </div>
      <div className="ttt-score ttt-score--o">
        <span className="ttt-score-label">O</span>
        <span className="ttt-score-value">{oWins}</span>
      </div>
    </div>
  );
}

/**
 * Main App Component orchestrates the game state and layout.
 */
// PUBLIC_INTERFACE
function App() {
  /** Tic Tac Toe game using modern, responsive Ocean Professional theme. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);

  const result = useMemo(() => calculateWinner(squares), [squares]);
  const currentPlayer = xIsNext ? 'X' : 'O';

  const gameOver = Boolean(result.winner) || result.isTie;

  const handleSquareClick = (index) => {
    if (squares[index] || gameOver) return;
    const next = squares.slice();
    next[index] = currentPlayer;
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  // Update wins when a winner appears
  React.useEffect(() => {
    if (result.winner === 'X') setXWins((w) => w + 1);
    if (result.winner === 'O') setOWins((w) => w + 1);
    // Only run when a win is detected
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.winner]);

  return (
    <div className="ttt-app" style={{ backgroundColor: theme.background, color: theme.text }}>
      <div className="ttt-container">
        <header className="ttt-header">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className="ttt-subtitle">Ocean Professional</p>
          <Scoreboard xWins={xWins} oWins={oWins} />
          <StatusBar currentPlayer={currentPlayer} winner={result.winner} isTie={result.isTie} />
        </header>

        <main className="ttt-main">
          <div
            className="ttt-surface"
            style={{
              background: theme.surface,
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              border: '1px solid rgba(37, 99, 235, 0.08)',
            }}
          >
            <Board
              squares={squares}
              winningLine={result.line}
              onSquareClick={handleSquareClick}
            />
          </div>
        </main>

        <footer className="ttt-footer">
          <Controls onRestart={handleRestart} disabled={!gameOver && squares.every((s) => !s)} />
        </footer>
      </div>
    </div>
  );
}

export default App;
