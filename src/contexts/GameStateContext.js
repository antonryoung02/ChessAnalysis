import React, {useState, createContext, useContext, useEffect} from "react";
import { Chess, Move } from 'chess.js'

let GameStateContext = createContext();

export function GameStateProvider({children}) {
    //manipulate state here
    const [pgn, setPgn] = useState("");
    const [history, setHistory] = useState([]);
    const [moveIndex, setMoveIndex] = useState(0);
    const [game, setGame] = useState(new Chess());

    useEffect(() => {
        game.loadPgn(pgn);
        console.log("Setting game in gameContext to", pgn)
        setHistory(game.history())
    }, [pgn])
    
    function getBoardAtMove(moveNumber) {
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
        let game = new Chess();
        game.loadPgn(pgnString);
        return game.fen();
    }


    return (
        <GameStateContext.Provider value={{moveIndex, setMoveIndex, history, pgn, setPgn, game, getBoardAtMove}}>
            {children}
        </GameStateContext.Provider>
    )
}

export function useGameState() {
    return useContext(GameStateContext);
}