import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onClear: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClear }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        setTimeout(onClear, 300); // clear msg after fade out
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [message, onClear]);

  return (
    <div 
      className={`fixed top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-7 py-3.5 rounded-full z-[200] font-bold shadow-2xl transition-all duration-300 pointer-events-none whitespace-nowrap ${show ? 'opacity-100 translate-y-2' : 'opacity-0 -translate-y-2'}`}
    >
      {message}
    </div>
  );
};

export default Toast;