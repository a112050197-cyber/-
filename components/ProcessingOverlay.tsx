
import React from 'react';
import { AppStep } from '../types';

interface ProcessingOverlayProps {
  step: AppStep;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ step }) => {
  const getStatusText = () => {
    switch (step) {
      case 'analyzing_user': return '分析人物特徵中';
      case 'analyzing_cloth': return '解構服裝細節中';
      case 'generating': return '正在為您合成專屬穿搭';
      default: return '處理中';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md">
      <div className="text-center">
        <div className="mb-8 flex justify-center space-x-2">
          <div className="w-1.5 h-1.5 bg-[#d4a3a3] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-[#d4a3a3] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-[#d4a3a3] rounded-full animate-bounce"></div>
        </div>
        <h3 className="font-serif italic text-3xl text-gray-800 mb-2">{getStatusText()}</h3>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">請稍候，AI 正在精心模擬</p>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
