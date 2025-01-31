import {useRef} from "react";
import {Chess} from "chess.js";
import { isValidPgn } from "./Utils";

function GameInput() {
    const textRef = useRef(null);

    function handleSubmit() {
        let textContent = textRef.current.value;
        if (isValidPgn(textContent)) {
            // do something
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