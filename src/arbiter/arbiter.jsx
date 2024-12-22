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

    performMove: function ({ position, piece, rank, file, x, y }) {
        if (piece.endsWith('p')) {
            return movePawn({ position, piece, rank, file, x, y });
        } else if (piece) {
            return movePiece({ position, piece, rank, file, x, y });
        }
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
    }
}

export default arbiter;
