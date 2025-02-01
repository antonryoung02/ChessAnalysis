import { Move } from "chess.js";
import {computeSquareLocation, findSquare, findMoveType} from "./Utils";
import { useEvaluation } from "./contexts/EvaluationContext";
import { useGameState } from "./contexts/GameStateContext";
function MoveRating(props) {
    const {moveTypes} = useEvaluation();
    const {moveIndex, history} = useGameState();
    if (!history || !moveTypes) {
        return;
    }
    let move = history[moveIndex];
    let boardWidth = props.boardWidth;
    let moveType = moveTypes[moveIndex];
    if (!moveTypes || !moveType) {
        return;
    }
    let square = findSquare(move, moveIndex);
    let res = computeSquareLocation(square, boardWidth);
    // load correct image given delta

    return (
        <div className="absolute w-10 h-10" style={{"top":`${res.top}px`, "left":`${res.left}px`}}>
            <img src={`${moveType}.png`}/>
        </div>
    )
}

export default MoveRating;