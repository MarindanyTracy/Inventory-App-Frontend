import React from 'react';
import LoaderImg from '../../assets/loader.gif';
import ReactDOM from 'react-dom';
import './loader.scss';

const Loader = () => {
  return ReactDOM.createPortal(
    <div className='wrapper'>
      <div className='loader'>
        <img src={LoaderImg} alt="Loading Spinner" />
      </div>
    </div>,
    document.getElementById("loader")
  )
}

export const SpinnerImg = () => {
  return (
    <div className='--center-all'>
      <img src={LoaderImg} alt="Loading Spinner" />
    </div>
  )
}

export default Loader
