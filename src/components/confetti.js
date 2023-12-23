/* eslint-disable jsx-a11y/alt-text */
// import React, { useState } from 'react';
// import ConfettiExplosion from 'react-confetti-explosion';

// function PPP() {
//     const [isExploding, setIsExploding] = useState(false);

//     return (
//         <div className='h-screen flex justify-center items-start'>
//             {isExploding &&
//                 <ConfettiExplosion
//                 width={window.outerWidth}
//                 height={window.outerHeight}
//                 force={0.2}
//                 colors={['#ff0000', '#ffff00', '#0000ff', '#00ff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000']}
//                 />
//             }
//             <button onClick={() => setIsExploding(!isExploding)}>
//                 Toggle Confetti
//             </button>
//         </div>
//     );
// }

// export default PPP;

import React, { useState ,useEffect} from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

function Confetti() {
  const avatar = createAvatar(initials, {
    seed: 'Rocky',
    dataUri: true,
  });
  console.log(avatar);
  const svg = avatar.toString();
  console.log(svg);
  return (
    <>
       {/* <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} className='h-screen w-screen'/> */}
       <img
  src="https://api.dicebear.com/7.x/initials/svg?seed=Rocky"
  alt="avatar" className='h-screen w-screen'/>
    </>
  );
}

// Create a function to use the Confetti component
function runConfetti() {
  return <Confetti />;
}

export default runConfetti;




