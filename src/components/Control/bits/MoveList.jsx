import { useAppContext }from '../../../contexts/Context'
import Timer from '../../Timer/Timer';
import './MoveList.css';

const MovesList = () => {

    const { appState : {movesList} } = useAppContext();

    return <div className='moveslist-container'>
                <Timer />
    <div className='moves-list'>
        {movesList.map((move,i) => 
            <div key={i} data-number={Math.floor(i/2)+1}>{move}</div>
        )}
    </div>
    </div>
}

export default MovesList