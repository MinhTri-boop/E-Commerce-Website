import { useState, useEffect } from 'react';

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsHiding(true);
    }, 600);

    const timer2 = setTimeout(() => {
      setIsVisible(false);
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div id="preloader" className={isHiding ? 'hiding' : ''}>
      <div className="jumper">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Preloader;
