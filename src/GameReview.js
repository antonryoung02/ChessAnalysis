import { useEvaluation } from "./contexts/EvaluationContext";

function GameReview() {
    const {moveTypes, accuracies} = useEvaluation();

    const moveTypesCategories = ['brilliant', 'great', 'best', 'excellent', 'good', 'inaccuracy', 'mistake', 'miss', 'blunder'];
    return (
        <div className="flex flex-col gap-6 w-3/4">
            <div className="grid grid-cols-2 text-white text-center gap-2">

                <div className="w-full h-12 content-center bg-white text-black font-semibold">{accuracies[0].toFixed(3) * 100}</div>
                <div className="w-full h-12 content-center bg-slate-700 text-white font-semibold">{accuracies[1].toFixed(3) * 100}</div>
            </div>
            <div className="grid grid-cols-3 text-white gap-x-6 gap-y-4 text-center font-semibold">
                {moveTypesCategories.map(move => {
                    return (
                    <>
                    <p>{getMoveTypeFrequencyForPlayer(0, move, moveTypes)}</p>
                    <img className="place-self-center" src={`${move}.png`} width={24}></img>
                    <p>{getMoveTypeFrequencyForPlayer(1, move, moveTypes)}</p>
                    </>
                    )
                })}
            </div>
        </div>
    )
}

function getMoveTypeFrequencyForPlayer(player, type, moveTypes) {
    let count = 0;
    for (let i=0; i<moveTypes.length; i++) {
        if (i % 2 == player && moveTypes[i] === type) {
            count += 1;
        }
    }
    return count;
}

export default GameReview;