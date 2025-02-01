import React, {useState, createContext, useContext, useEffect} from "react";
import { Chess, Move } from 'chess.js'
let GameStateContext = createContext();

export function GameStateProvider({children}) {
    //manipulate state here
    let examplePgn = "1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0"
    const [pgn, setPgn] = useState(examplePgn);
    const [history, setHistory] = useState([]);
    const [moveIndex, setMoveIndex] = useState(0);
    const [game, setGame] = useState(new Chess());

    useEffect(() => {
        game.loadPgn(pgn);
        console.log("Setting game in gameContext to", pgn)
        setHistory(game.history());
        setMoveIndex(0);
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