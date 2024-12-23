import React, { useRef, useState } from 'react';
import './Pieces.css';
import Piece from './Piece';
import { useAppContext } from '../../contexts/Context';
import { clearCandidates, makeNewMove } from '../../reducer/actions/move';
import arbiter from '../../arbiter/arbiter';
import { openPromotion } from '../../reducer/actions/popup';
import { getCastleDirection } from '../../arbiter/getMoves';
import { detectInsufficientMaterial, detectStalemate, updateCastling } from '../../reducer/actions/Game';

const Pieces = () => {
    const ref = useRef();
    const { appState, dispatch } = useAppContext();
    const currentPosition = appState.position [appState.position.length - 1]

    const calCoord = (e) => {
        const { width, left, top } = ref.current.getBoundingClientRect();
        const size = width / 8;
        const y = Math.floor((e.clientX - left) / size);
        const x = 7 - Math.floor((e.clientY - top) / size);
        return { x, y };
    };

    const openPromotionBox = ({rank, file, x, y}) => {
        dispatch(openPromotion({
            rank : Number(rank),
            file : Number(file),
            x, 
            y
        }))
    }

    const updateCastlingState = ({ piece, rank, file }) => {
        const direction = getCastleDirection({
            castleDirection: appState.castleDirection, 
            piece,
            rank,
            file,
        });
    
        if (direction) {
            dispatch(updateCastling(direction));
        }
    };

    const move = e => {
        const { x, y } = calCoord(e);
        const [piece, rank, file] = e.dataTransfer.getData('text').split(',');
    
        if (appState.candidateMoves?.some(m => m[0] === x && m[1] === y)) {
            const opponent = piece.startsWith('b') ? 'w' : 'b';
            const castleDirection = appState.castleDirection[`${piece.startsWith('b') ? 'w' : 'b'}`];
    
            if ((piece === 'wp' && x === 7) || (piece === 'bp' && x === 0)) {
                openPromotionBox({ rank, file, x, y });
                return;
            }
            if (piece.endsWith('r') || piece.endsWith('k')) {
                updateCastlingState({ piece, rank, file });
            }
    
            const newPosition = arbiter.performMove({
                position: currentPosition,
                piece,
                rank,
                file,
                x,
                y
            });
            dispatch(makeNewMove({ newPosition }));
    
            if (arbiter.insufficientMaterial({position: newPosition})) {
                dispatch (detectInsufficientMaterial())
                ;
                
            }else if (arbiter.isStalemate({position: newPosition, player: opponent, castleDirection}))
                dispatch (detectStalemate());
        }
        dispatch(clearCandidates());
    };
    

    const onDrop = (e) => {
        e.preventDefault();
        move (e);
    };

    const onDragOver = (e) => e.preventDefault();

    return (
        <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            ref={ref}
            className="pieces"
        >
            {currentPosition.map((r, rank) =>
                r.map((f, file) =>
                    currentPosition[rank][file] ? (
                        <Piece
                            key={`${rank}-${file}`}
                            rank={rank}
                            file={file}
                            piece={currentPosition[rank][file]}
                        />
                    ) : null
                )
            )}
        </div>
    );
};

export default Pieces;
