import { type FC } from 'react';

export const BackgroundCurtains: FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 bg-[#0b0216]" />
    <div className="absolute inset-0 flex justify-center opacity-60">
      <div className="w-[10%] h-full bg-gradient-to-b from-blue-400/20 via-blue-800/10 to-transparent blur-2xl" />
      <div className="w-[8%] h-full bg-gradient-to-b from-teal-300/30 via-teal-700/10 to-transparent blur-xl" />
      <div className="w-[20%] h-full bg-gradient-to-b from-blue-100/5 via-blue-900/5 to-transparent blur-[100px]" />
      <div className="w-[8%] h-full bg-gradient-to-b from-teal-300/30 via-teal-700/10 to-transparent blur-xl" />
      <div className="w-[10%] h-full bg-gradient-to-b from-blue-400/20 via-blue-800/10 to-transparent blur-2xl" />
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-[#0b0216] to-transparent" />
  </div>
);
