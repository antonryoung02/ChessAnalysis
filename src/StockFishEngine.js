import { Evaluation } from "./Evaluation";

class StockFishEngine {
    constructor(enginePath) {
        if (!window.stockfishWorker) {
            window.stockfishWorker = new Worker(enginePath);
          }
        this.worker = window.stockfishWorker;
        this.depth = 15;
        this.evaluating = false;
    }

    async getEvaluation(fen) {
        if (this.evaluating) {
            return new Evaluation("", "", "");
        }
        this.evaluating = true;
        let evalType = null;
        let evaluation = null;
        let bestMove = null;
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.worker.removeEventListener("message", handleMessage);
                this.evaluating = false;
                reject(new Error("Engine response timeout"));
            }, 2000); // Adjust the timeout as needed

            const handleMessage = (event) => {
                let result = event.data;
                console.log(result);
                if (result.includes(`info depth ${this.depth}`)) {
                    let evaluationMatch = result.match(/score cp (-?\d+)/)
                    if (evaluationMatch) {
                        evalType="eval";
                        evaluation=Number(evaluationMatch[1] / 100); 
                    }
                    let forcedMateMatch = result.match(/score mate (-?\d+)/);
                    if (forcedMateMatch) {
                        evalType="mate";
                        evaluation=Number(forcedMateMatch[1]);   
                    }
                } 
                if (result === "info depth 0 score mate 0") {
                    evalType="game over"
                    evaluation="0";
                    bestMove="none";
                } 
                if (result.includes("bestmove")) {
                    bestMove = result.match(/bestmove\s+(\S+)/)[1];
                }
                if (evalType && evaluation && bestMove){
                    clearTimeout(timeout)
                    this.evaluating = false;
                    this.worker.removeEventListener("message", handleMessage)
                    console.log("FINISHED EVAL FEN", fen);
                    resolve(new Evaluation(evalType, evaluation, bestMove))
                }
            }
            this.worker.addEventListener("message", handleMessage)
            this.worker.postMessage(`position fen ${fen}`);
            this.worker.postMessage(`go depth ${this.depth}`);
        })
    }
}
const engineFile = "/stockfish-16.1-single.js";
export const engine = new StockFishEngine(engineFile)