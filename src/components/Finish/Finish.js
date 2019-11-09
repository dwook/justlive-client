import React from 'react';
import Lottie from 'react-lottie';
import FinishAsset from '../../assets/done.json';

const lottieOptions = {
  animationData: FinishAsset,
  loop: false,
  autoplay: false,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const Finish = () => {
  return (
    <Lottie
      options={lottieOptions}
      isClickToPauseDisabled={false}
      style={{ width: '300px', height: '300px' }}
    />
  );
};

export default Finish;
