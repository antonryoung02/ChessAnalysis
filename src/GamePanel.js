import GameAnalysis from "./GameAnalysis";
import GameReview from "./GameReview";
import {useState} from "react";

function GamePanel(props) {
    let allMoves = props.allMoves;
    let index = props.index;
    let setIndex = props.setIndex;

    const [selectedView, setSelectedView] = useState('review');
    const selectedStyle = {'border-color':'white', 'border-radius':2}

    return (
        <div className="w-90 h-full bg-slate-900 flex flex-none">
            <div className="w-full flex items-center flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <button className={`text-xl font-bold text-white p-6 ${selectedView === "analysis" && "border-2 border-white"}` }
                    onClick={() => setSelectedView('analysis')}>Analysis</button>

                    <button className={`text-xl font-bold text-white p-6 ${selectedView === "review" && "border-2 border-white"}`}
                   onClick={() => setSelectedView('review')}>Game Review</button>
                </div>
                {
                    selectedView === "analysis" ? <GameAnalysis allMoves={allMoves} index={index} setIndex={setIndex}/> : <GameReview /> 
                }
            </div>
        </div>
    )
}

export default GamePanel;