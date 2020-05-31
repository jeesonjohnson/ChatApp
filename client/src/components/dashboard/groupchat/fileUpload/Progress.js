import React from 'react';

const Progress = ({ percentage,loadingState}) => {
  return (
    <div className='progress'>
      <div
        className='progress-bar progress-bar-striped bg-success'
        role='progressbar'
        style={{ width: `${percentage}%` }}>
        {percentage}%
      </div>
      <p>{loadingState}</p>
    </div>
  );
};

export default Progress;
