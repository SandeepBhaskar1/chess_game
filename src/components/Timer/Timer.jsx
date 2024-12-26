import React, { useEffect } from "react";
import { useAppContext } from "../../contexts/Context";
import './Timer.css';
import { decrementTimer } from "../../reducer/actions/game";

const Timer = () => {
    const { appState, dispatch } = useAppContext();
    const { turn, whiteTime, blackTime, status } = appState;

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("Timer tick for:", turn);
            dispatch(decrementTimer(turn));
        }, 1000);
    
        return () => clearInterval(interval);
    }, [turn, dispatch]);
    
    

    return (
        <div className="timer">
            <div className="timer__white">
                White: {Math.floor(whiteTime / 60)}:{String(whiteTime % 60).padStart(2, "0")}
            </div>
            <div className="timer__black">
                Black: {Math.floor(blackTime / 60)}:{String(blackTime % 60).padStart(2, "0")}
            </div>
        </div>
    );
};

export default Timer;
