
function EvaluationBar(props) {
    let type = props.type;
    let value = props.value;
    let score = getScore(type, value) 
    function sigmoid(x) {
        return Math.E ** (0.5*x) / (1 + Math.E ** (0.5*x))
    }

    function getScoreLineHeight(type, score) {
        if (type === "mate") {
            if (score < 0) {
                return 0;
            }
            return 100;
        }
        return 100 + 100 * (sigmoid(score) - 1)
    
    }

    function getScore(type, score) {
        if (type === "mate") {
            return "M" + score
        } 
        return score
    }

    return (
        <div className="w-8 h-full flex flex-col relative bg-black border-2 border-gray-800 justify-end">
            <div className={`bg-white w-8`} 
            style={{ height: `${getScoreLineHeight(type, value)}%` }}>
            </div>
            <p className={`absolute text-xs font-bold ${score > 0 ? "text-black" : "top-0 text-white"}`}>{score}</p>
        </div>
    )
        
    
}

export default EvaluationBar;