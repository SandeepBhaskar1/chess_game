import { useAppContext }from '../../../contexts/Context'
import { takeBack } from '../../../reducer/actions/move';
import './TakeBack.css';

const TakeBack = () => {

    const { dispatch } = useAppContext();

    return <div className='tb-button'>
        <button onClick={() => dispatch(takeBack())}>Take Back</button>
    </div>
}

export default TakeBack