import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative flex flex-col h-[100dvh] bg-bg-dark text-white overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#172554,#020617)]">
        <div className="absolute w-[300px] h-[300px] bg-neon-purple rounded-full blur-[90px] opacity-50 -top-[10%] -left-[10%] animate-float"></div>
        <div className="absolute w-[250px] h-[250px] bg-neon-blue rounded-full blur-[90px] opacity-50 bottom-[20%] -right-[10%] animate-float [animation-delay:-5s]"></div>
      </div>
      <main className="flex-1 overflow-y-auto no-scrollbar overflow-x-hidden p-5 pb-[100px]">
        {children}
      </main>
    </div>
  );
};

export default Layout;