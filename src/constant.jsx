import { createPosition } from "./help";

export const Status = {
    'ongoing' : 'Ongoing',
    'promoting' : 'Promoting',
    'white' : 'White wins',
    'black' : 'Black wins',
    'stalemate' : 'Game Draws Due To Stalemate',
    'insufficient' : 'Game draws due to Insufficient Material',
}

export const initGameState = {
    position : [createPosition ()],
    turn : 'w',
    candidateMoves : [],
    promotionSquare : null,
    status : Status.ongoing,
    castleDirection : {
        w : 'both',
        b : 'both',
    }
}