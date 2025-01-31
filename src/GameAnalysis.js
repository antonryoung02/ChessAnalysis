import { AiOutlineLeft, AiOutlineRight, AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";

function GameAnalysis(props) {
    let allMoves = props.allMoves;
    let index = props.index;
    let setIndex = props.setIndex;

    return (
        <>
        <div className="grid h-96 w-full grid-cols-2 gap-y-0 overflow-scroll bg-slate-700"
            style={{
                scrollbarWidth: "thin",
                scrollbarColor: "white transparent", 
            }}>
        {allMoves.map((move, i) => {
            return <button key={i} className="text-white px-2 text-left" onClick={() => setIndex(i)} style={{backgroundColor:`${i === index ? "gray" : ""}`}}>{move}</button>
        })}
        </div>
        <div className="flex flex-row gap-2">
            <button className="p-3 text-white bg-slate-700" onClick={() => setIndex(0)}><AiOutlineDoubleLeft size={36} /></button>
            <button className="p-3 text-white bg-slate-700" onClick={() => setIndex(index - 1)}><AiOutlineLeft size={36} /></button>
            <button className="p-3 text-white bg-slate-700" onClick={() => setIndex(index + 1)}><AiOutlineRight size={36}/></button>
            <button className="p-3 text-white bg-slate-700" onClick={() => setIndex(allMoves.length-1)}><AiOutlineDoubleRight size={36} /></button>

        </div>
        </>
    )
}

export default GameAnalysis;