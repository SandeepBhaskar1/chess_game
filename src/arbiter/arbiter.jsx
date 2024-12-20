import { getBishopMoves, getKingMoves, getKnightMoves, getQueenMoves, getRookMoves, getSoldiersCapture, getSoldiersMoves, getCastlingMoves } from "./getMoves"
import { movePawn, movePiece } from "./move";

const arbiter = {
    getRegularMoves : function ({position, previousPosition, piece, rank, file}) {
        if (piece.endsWith('n'))
            return getKnightMoves({position, rank, file});

        if (piece.endsWith('b'))
            return getBishopMoves({position, piece, rank, file});

        if (piece.endsWith('q'))
            return getQueenMoves({position, piece, rank, file});

        if (piece.endsWith('k'))
            return getKingMoves({position, piece, rank, file});

        if (piece.endsWith('r'))
        return getRookMoves({position, piece, rank, file});

        if (piece.endsWith('p'))
        return getSoldiersMoves({position, piece, rank, file});
            
        },

        getValidMoves : function ({position, previousPosition, castleDirection, piece, rank, file}) {
            let moves = this.getRegularMoves({position, piece, rank, file})
            if ( piece.endsWith('p')) {
                moves =[
                    ...moves,
                    ...getSoldiersCapture ({position, previousPosition, piece, rank, file})
                ]
            }
            if ( piece.endsWith('k')) {
                moves =[
                    ...moves,
                    ...getCastlingMoves ({position, castleDirection, piece, rank, file})
                ]
            }
            return moves
        },

        performMove: function ({ position, piece, rank, file, x, y }) {
            if (piece.endsWith('p')) {
                return movePawn({ position, piece, rank, file, x, y });
            } else if (piece) {
                return movePiece({ position, piece, rank, file, x, y });
            } 
        }
    }
        

export default arbiter;