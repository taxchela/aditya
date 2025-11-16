import React, { useState, useEffect } from 'react';

interface IntroAnimationProps {
  onAnimationEnd: () => void;
}

const messages = [
  "Hey Aditya,",
  "oh Sorry! my bad",
  "Hey future CA Aditya!",
  "Here is your Quant Dashboard!",
];

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onAnimationEnd }) => {
  const [step, setStep] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    timers.push(setTimeout(() => setStep(1), 2000));
    timers.push(setTimeout(() => setStep(2), 4000));
    timers.push(setTimeout(() => setStep(3), 6000));
    
    timers.push(setTimeout(() => {
        setFadingOut(true);
    }, 8000)); 

    timers.push(setTimeout(() => {
        onAnimationEnd();
    }, 9000)); 

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onAnimationEnd]);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900 transition-opacity duration-1000 ${fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <h1 key={step} className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 text-transparent bg-clip-text animate-fade-in text-center px-4">
            {messages[step]}
         </h1>
    </div>
  );
};

export default IntroAnimation;