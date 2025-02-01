import { Evaluation } from "./Evaluation";
import Queue from "queue-fifo";

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
            throw new Error("Stockfish is in use. Instead, queue a function with StockfishTaskManager")
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
                    resolve(new Evaluation(evalType, evaluation, bestMove))
                }
            }
            this.worker.addEventListener("message", handleMessage)
            this.worker.postMessage(`position fen ${fen}`);
            this.worker.postMessage(`go depth ${this.depth}`);
        })
    }
}

class StockFishTaskManager {
    constructor() {
        this.promiseChain = Promise.resolve();
    }

    async completeTask(fn) {
        const newTask = async() => {
            return await fn();
        }
        const newPromiseChain = this.promiseChain.then(newTask)
        .catch((error) => {
            return null;
        })
        this.promiseChain = newPromiseChain;
        return newPromiseChain;
    }

}

const engineFile = "/stockfish-16.1-single.js";
export const engine = new StockFishEngine(engineFile)
export const engineTaskManager = new StockFishTaskManager()