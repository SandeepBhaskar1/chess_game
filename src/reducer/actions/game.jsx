import actionTypes from '../actionTypes';
import { initGameState } from '../../constants';

export const updateCastling = (direction) => {
    return {
        type: actionTypes.CAN_CASTLE,
        payload: direction,
    }
}

export const detectStalemate = () => {
    return {
        type: actionTypes.STALEMATE,
    }
}

export const detectInsufficientMaterial = () => {
    return {
        type: actionTypes.INSUFFICIENT_MATERIAL,
    }
}

export const detectCheckmate = winner => {
    return {
        type: actionTypes.WIN,
        payload : winner
    }
}

export const setupNewGame = () => {
    return {
        type: actionTypes.NEW_GAME,
        payload : initGameState
    }
}

export const decrementTimer = (player) => {
    return {
        type : player === 'w' ? actionTypes.DECREMENT_WHITE_TIMER : actionTypes.DECREMENT_BLACK_TIMER,
    }
}