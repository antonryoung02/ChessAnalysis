import {useRef} from "react";
import {Chess} from "chess.js";
import { isValidPgn } from "./Utils";
import { useGameState } from "./contexts/GameStateContext";
function GameInput() {
    const textRef = useRef(null);
    const {setPgn} = useGameState();

    function handleSubmit() {
        let textContent = textRef.current.value;
        if (isValidPgn(textContent)) {
            console.log("setting pgn to ", textContent);
            setPgn(textContent);
        } else {
            console.log("PGN is invalid!");
        }
   
    }
    return (
    <div className="flex flex-row w-1/2">
        <input ref={textRef} type="text" placeholder="Enter game PGN" className="w-full m-2"></input>
        <button className="bg-slate-500 p-1 border-gray-900 m-2" onClick={handleSubmit}>Submit</button>
      </div>
    )
}

export default GameInput;