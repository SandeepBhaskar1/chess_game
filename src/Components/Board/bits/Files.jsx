import React from 'react';
import './Files.css';
import { getCharacter } from '../../../help';

const Files = ({files}) => {
  return (
    <div className='files'>
        {files.map((file, index) => <span key={`${files}-${index}`}> {getCharacter (file)} </span>)}
    </div>
  )
}

export default Files;
