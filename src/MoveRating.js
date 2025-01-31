import { Move } from "chess.js";
import {computeSquareLocation, findSquare, findMoveType} from "./Utils";
import { useEvaluation } from "./contexts/EvaluationContext";

function MoveRating(props) {
    const {moveTypes} = useEvaluation();
    let move = props.move;
    let moveIndex = props.moveIndex;
    let boardWidth = props.boardWidth;
    if (!moveTypes || !move) {
        return;
    }
    let moveType = moveTypes[moveIndex];
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