import React, {useState, createContext, useContext, useEffect, useMemo} from "react";
import {useGameState} from "./GameStateContext";
import {engine, engineTaskManager} from "../StockFishEngine";
import {Chess } from "chess.js";
import { historyToFen, findMoveType, isValidPgn } from "../Utils";
let EvaluationContext = createContext();

export function EvaluationProvider({children}) {
    const {moveIndex, pgn, game} = useGameState();
    // let game = new Chess();
    // //const examplePgn = "1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0"
    // game.loadPgn(examplePgn)
    // let history = game.history();
    const [evaluation, setEvaluation] = useState({"type":"", "value":0});
    const [deltas, setDeltas] = useState(null);
    const [moveTypes, setMoveTypes] = useState(null);
    const [accuracies, setAccuracies] = useState(null);

    useEffect(() => {
      async function getDeltas() {
        setAccuracies(null);
        setDeltas(null);
        setMoveTypes(null);
        let newDeltas = await engineTaskManager.completeTask(() => getDeltaEvaluations(game, engine));
        let newTypes = convertDeltasToTypes(newDeltas);
        let newAccuracies = convertTypesToAccuracies(newTypes);
        setDeltas(newDeltas);
        setMoveTypes(newTypes);
        setAccuracies(newAccuracies);
      }
      getDeltas();
    }, [pgn]);

    useEffect(() => {
        let boardPosition = getBoardAtMove(moveIndex, game.history())
        async function setEval() {
          try {
            let result = await engineTaskManager.completeTask(() => engine.getEvaluation(boardPosition))
            if (moveIndex % 2 == 0) {
              result.value *= -1;
            }
            setEvaluation(result);
          } catch (error) {
            console.error(error)
          }
        }
        setEval()
      }, [moveIndex]);

      async function getDeltaEvaluations(game, engine) {
        let deltas = [];
        let history = game.history();
        console.log("getDeltaEvaluations called with history ", history);
        for (let i=0; i < history.length; i++) {
            if (i === 0) {
                deltas.push(0)
            } else {
                let bestMoveEvaluation = await engine.getEvaluation(historyToFen(history.slice(0,i)));
                let chosenMoveEvaluation = await engine.getEvaluation(historyToFen(history.slice(0,i+1))); 
                if (i % 2 == 0) {
                    bestMoveEvaluation.value *= -1;
                  } else {
                    chosenMoveEvaluation.value *= -1;
                  }
                let difference = bestMoveEvaluation.value - chosenMoveEvaluation.value;

                deltas.push(Math.abs(difference))
            }

        }
        console.log("deltas", deltas);
        return deltas
    }

    function convertDeltasToTypes(deltas) {
        let moves = [];
        for (let i = 0; i < deltas.length; i++) {
            let moveType = findMoveType(deltas[i]);
            moves.push(moveType);
        }
        return moves;
    }

    function convertTypesToAccuracies(types) {
        const conversion = {"best":1, "excellent":0.9, "good":0.8, "inaccuracy":0.7, "mistake":0.5, "miss": 0.5, "blunder":0.3}
        let whiteSum = 0;
        let numWhiteMoves = 0;
        let blackSum = 0;
        let numBlackMoves = 0;
        for (let i = 0; i < types.length; i++) {
            if (i % 2 == 0) {
                numWhiteMoves += 1;
                whiteSum += conversion[types[i]]
            } else {
                numBlackMoves += 1;
                blackSum += conversion[types[i]]       
            }
        }
        return [whiteSum/numWhiteMoves, blackSum/numBlackMoves];
    }

    return (
        <EvaluationContext.Provider value={{evaluation, deltas, moveTypes, accuracies}}>
            {children}
        </EvaluationContext.Provider>
    )
}

function getBoardAtMove(moveNumber, history) {
    let moves = history.slice(0, moveNumber+1);
    return _createPgnFromMoves(moves);
}


function _createPgnFromMoves(moves) {
    let pgnString = "";
    let i = 0;
    while (i < moves.length) {
        if (i % 2 == 0) {
            pgnString += `${i+1}. `;
        }
        pgnString += `${moves[i]} `;
        i += 1;
    }
    let game = new Chess()
    game.loadPgn(pgnString);
    return game.fen();
}

export function useEvaluation() {
    return useContext(EvaluationContext);
}