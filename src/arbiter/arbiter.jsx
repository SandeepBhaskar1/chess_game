import { areSameColorTiles, findPieceCoords } from "../help";
import { getBishopMoves, getKingMoves, getKnightMoves, getQueenMoves, getRookMoves, getSoldiersCapture, getSoldiersMoves, getCastlingMoves, getKingPosition, getPieces } from "./getMoves"
import { movePawn, movePiece } from "./move";

const arbiter = {
    getRegularMoves: function ({ position, previousPosition, piece, rank, file }) {
        if (piece.endsWith('n'))
            return getKnightMoves({ position, rank, file });

        if (piece.endsWith('b'))
            return getBishopMoves({ position, piece, rank, file });

        if (piece.endsWith('q'))
            return getQueenMoves({ position, piece, rank, file });

        if (piece.endsWith('k'))
            return getKingMoves({ position, piece, rank, file });

        if (piece.endsWith('r'))
            return getRookMoves({ position, piece, rank, file });

        if (piece.endsWith('p'))
            return getSoldiersMoves({ position, piece, rank, file });

        return [];
    },

    getValidMoves: function ({ position, previousPosition, castleDirection, piece, rank, file }) {
        let moves = this.getRegularMoves({ position, piece, rank, file });
        const notInCheckMoves = [];

        if (piece.endsWith('p')) {
            moves = [
                ...moves,
                ...getSoldiersCapture({ position, previousPosition, piece, rank, file })
            ];
        }

        if (piece.endsWith('k')) {
            moves = [
                ...moves,
                ...getCastlingMoves({ position, castleDirection, piece, rank, file })
            ];
        }

        moves.forEach(([x, y]) => {
            const positionAfterMove = this.performMove({ position, piece, rank, file, x, y });

            if (!this.isPlayerInCheck({ positionAfterMove, position, player: piece[0] }))
                notInCheckMoves.push([x, y]);
        });

        return notInCheckMoves;
    },

    isPlayerInCheck: function ({ positionAfterMove, position, player }) {
        const enemy = player.startsWith('w') ? 'b' : 'w';
        const kingPos = getKingPosition(positionAfterMove, player);
        const enemyPieces = getPieces(positionAfterMove, enemy);

        const enemyMoves = enemyPieces.reduce((acc, p) => acc = [
            ...acc,
            ...(p.piece.endsWith('p'))
                ? getSoldiersCapture({
                    position: positionAfterMove,
                    previousPosition: position,
                    ...p
                })
                : this.getRegularMoves({
                    position: positionAfterMove,
                    ...p
                })
        ], []);

        if (enemyMoves.some(([x, y]) => kingPos[0] === x && kingPos[1] === y))
            return true;

        return false;
    },

    performMove: function ({ position, piece, rank, file, x, y }) {
        if (piece.endsWith('p')) {
            return movePawn({ position, piece, rank, file, x, y });
        } else if (piece) {
            return movePiece({ position, piece, rank, file, x, y });
        }
    },

    isStalemate: function ({ position, player, castleDirection }) {
        const isInCheck = this.isPlayerInCheck({ positionAfterMove: position, player });
        if (isInCheck) return false;
    
        const pieces = getPieces(position, player);
        const moves = pieces.reduce((acc, p) => [
            ...acc,
            ...this.getValidMoves({
                position,
                castleDirection,
                ...p
            })
        ], []);
    
        return moves.length === 0;
    },

insufficientMaterial: function ({ position }) {
    const pieces = position.reduce((acc, rank) => 
        acc = [
            ...acc,
            ...rank.filter(x => x) 
    ], [])

    if (pieces.length === 2) return true;

    if (pieces.length === 3 && (pieces.some(p => p.endsWith('b') || p.endsWith('n'))))
        return true

    if (
        pieces.length === 4 &&
        pieces.every(p => p.endsWith('b') || p.endsWith('k')) &&
        new Set(pieces).size === 4
    ) {
        const wbCoords = findPieceCoords(position, 'wb');
        const bbCoords = findPieceCoords(position, 'bb');

        if (
            wbCoords?.[0] && 
            bbCoords?.[0] && 
            areSameColorTiles(wbCoords[0], bbCoords[0])
        ) {
            return true
        }
    }

    return false;
}


}

export default arbiter;
