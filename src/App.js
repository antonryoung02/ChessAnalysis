import './App.css';
import { Chessboard } from "react-chessboard";
import { Chess, Move } from 'chess.js'
import React, {useState, useEffect, useRef, useLayoutEffect} from "react";
import {engine} from "./StockFishEngine.js";
import EvaluationBar from './EvaluationBar.js';
import GamePanel from './GamePanel.js';
import MoveRating from './MoveRating.js';
import {useGameState} from "./contexts/GameStateContext.js";
import { useEvaluation } from './contexts/EvaluationContext.js';
import GameInput from './GameInput.js';

const examplePgn = "1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0"

function App() {
  const {moveIndex, setMoveIndex, history, setPgn, game, getBoardAtMove} = useGameState();
  const {evaluation, deltas} = useEvaluation();
  const boardRef = useRef(null);
  const [boardWidth, setBoardWidth] = useState(0);

  useLayoutEffect(() => {
    const updateBoardWidth = () => {
      if (boardRef.current) {
        setBoardWidth(boardRef.current.offsetWidth);
      }
    };
  
    updateBoardWidth(); // Set initial width
    window.addEventListener("resize", updateBoardWidth);
  
    return () => {
      window.removeEventListener("resize", updateBoardWidth);
    };
  }, []);
  // gameReview.getDeltaEvaluations()
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        setMoveIndex((prev) => Math.min(history.length-1, prev + 1));
      } else if (event.key === "ArrowLeft") {
        setMoveIndex((prev) => Math.max(0, prev - 1));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveIndex]);

  useEffect(() => {
    setPgn(examplePgn);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-600">
       <GameInput /> 
      <div className="flex flex-row w-3/5 h-auto relative">
        <EvaluationBar type={evaluation?.type ?? ""} value={evaluation?.value ?? 0}/>
        <div ref={boardRef} className="w-full h-auto">
          <Chessboard id="BasicBoard" position={getBoardAtMove(moveIndex)} arePiecesDraggable={false} customBoardStyle={{"position":"relative"}} />
        </div>
        <GamePanel allMoves={history} index={moveIndex} setIndex={setMoveIndex} />
        <MoveRating boardWidth={boardWidth} />
      </div>   

    </div>
  );
}

export default App;
