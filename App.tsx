
import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ProcessingOverlay from './components/ProcessingOverlay';
import { AppStep } from './types';
import * as api from './services/api';

const App: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [personImg, setPersonImg] = useState<{ base64: string; preview: string } | null>(null);
  const [clothImg, setClothImg] = useState<{ base64: string; preview: string } | null>(null);
  const [resultImg, setResultImg] = useState<string | null>(null);
  const [step, setStep] = useState<AppStep>('setup');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isFormValid = studentId.trim() !== '' && personImg !== null && clothImg !== null;

  const handleStartTryOn = async () => {
    if (!isFormValid) return;
    setStep('analyzing_user');
    setErrorMsg(null);
    setResultImg(null);

    try {
      const userDesc = await api.imageToText(
        studentId, 
        personImg!.base64, 
        "分析人物特徵：性別、動作、髮型與體型。請避免描述目前的服裝細節。"
      );

      setStep('analyzing_cloth');
      const clothDesc = await api.imageToText(
        studentId, 
        clothImg!.base64, 
        "詳細描述這件服裝：剪裁、布料、顏色與風格細節。"
      );

      setStep('generating');
      const finalPrompt = `時尚雜誌攝影風，一位具有以下特徵的模特兒：${userDesc}，穿著：${clothDesc}。極簡攝影棚背景，自然柔和光影，高級商業時尚感，8k。`;
      const base64Result = await api.textToImage(studentId, finalPrompt);

      setResultImg(`data:image/png;base64,${base64Result}`);
      setStep('success');
    } catch (err: any) {
      setErrorMsg(err.message || "發生未知錯誤，請稍後再試。");
      setStep('error');
    }
  };

  const reset = () => {
    setResultImg(null);
    setStep('setup');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen">
      {/* 標題欄 */}
      <header className="py-12 px-8 flex flex-col items-center justify-center border-b border-gray-100 bg-white">
        <h1 className="font-serif text-5xl md:text-6xl text-gray-900 mb-2 relative">
          formysis
          <span className="absolute -top-4 -right-8 font-cormorant italic text-lg text-[#d4a3a3]">for my sis</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mt-4">AI 虛擬試穿實驗室</p>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* 左側控制面板 */}
          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-8">
              <div className="border-l border-gray-900 pl-6 py-2">
                <h2 className="font-serif italic text-2xl mb-1">開始體驗</h2>
                <p className="text-[10px] text-gray-400 tracking-widest uppercase">請先輸入您的驗證身份</p>
              </div>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="學號 (例如: A0000000)"
                  className="w-full bg-transparent border-b border-gray-200 py-3 text-sm tracking-widest outline-none focus:border-[#d4a3a3] transition-colors uppercase"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={step !== 'setup' && step !== 'error' && step !== 'success'}
                />
              </div>

              <div className="grid grid-cols-1 gap-10">
                <ImageUploader 
                  id="person-upload"
                  label="01. 人物上傳"
                  onImageSelect={(base64, file) => setPersonImg({ base64, preview: URL.createObjectURL(file) })}
                  previewUrl={personImg?.preview || null}
                  disabled={step !== 'setup' && step !== 'error' && step !== 'success'}
                />
                <ImageUploader 
                  id="cloth-upload"
                  label="02. 服裝上傳"
                  onImageSelect={(base64, file) => setClothImg({ base64, preview: URL.createObjectURL(file) })}
                  previewUrl={clothImg?.preview || null}
                  disabled={step !== 'setup' && step !== 'error' && step !== 'success'}
                />
              </div>

              <button 
                onClick={handleStartTryOn}
                disabled={!isFormValid || (step !== 'setup' && step !== 'error' && step !== 'success')}
                className={`w-full py-5 text-sm tracking-[0.3em] font-medium transition-all duration-700
                  ${isFormValid 
                    ? 'bg-black text-white hover:bg-[#d4a3a3]' 
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
              >
                生成專屬穿搭
              </button>
            </div>
          </div>

          {/* 右側結果與預覽展示區 */}
          <div className="lg:col-span-8">
            <div className="relative group">
              {/* 背景裝飾 */}
              <div className="absolute -top-10 -right-10 w-64 h-80 bg-[#f7efef] -z-10 transition-transform duration-1000 group-hover:scale-110"></div>
              
              <div className="bg-white p-6 md:p-10 shadow-2xl min-h-[700px] flex flex-col">
                <div className="flex justify-between items-baseline mb-12 border-b border-gray-50 pb-6">
                  <span className="font-cormorant italic text-gray-400 font-medium text-xl">Design Portfolio</span>
                  <span className="text-[9px] uppercase tracking-widest text-gray-300">MODERN & CITY WEDDING</span>
                </div>

                <div className="flex-grow space-y-12">
                  {/* 主要結果區域 */}
                  <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden shadow-inner">
                    {resultImg ? (
                      <div className="w-full h-full animate-in fade-in zoom-in-95 duration-1000">
                        <img src={resultImg} alt="試穿結果" className="w-full h-full object-contain" />
                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 border border-gray-100">
                           <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-800">Final Creation</p>
                        </div>
                      </div>
                    ) : errorMsg ? (
                      <div className="w-full h-full flex items-center justify-center p-12">
                        <div className="text-center">
                          <h4 className="font-serif italic text-2xl text-red-900 mb-4">生成過程中發生錯誤</h4>
                          <p className="text-xs text-gray-500 mb-8 tracking-wide leading-relaxed">{errorMsg}</p>
                          <button onClick={reset} className="text-[10px] uppercase tracking-[0.3em] border-b border-black pb-1 hover:text-[#d4a3a3] hover:border-[#d4a3a3] transition-all">重新嘗試</button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-100">
                        <div className="text-center">
                          <div className="w-px h-24 bg-gray-200 mx-auto mb-8"></div>
                          <p className="font-serif italic text-xl text-gray-300">等待 AI 生成您的專屬造型</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 即時上傳預覽區域 (要求：人物原圖、服裝原圖同時顯示) */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase border-b border-gray-50 pb-2">01. Source Profile</p>
                       <div className="aspect-[3/4] bg-gray-50 overflow-hidden relative">
                         {personImg ? (
                           <img src={personImg.preview} alt="人物原圖" className="w-full h-full object-cover animate-in fade-in duration-500" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center italic text-gray-200 text-sm font-serif">Empty</div>
                         )}
                       </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase border-b border-gray-50 pb-2">02. Selected Garment</p>
                       <div className="aspect-[3/4] bg-gray-50 overflow-hidden relative border border-gray-100">
                         {clothImg ? (
                           <img src={clothImg.preview} alt="服裝原圖" className="w-full h-full object-cover animate-in fade-in duration-500" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center italic text-gray-200 text-sm font-serif">Empty</div>
                         )}
                       </div>
                    </div>
                  </div>
                </div>

                {resultImg && (
                  <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-50">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 tracking-widest uppercase">Powered by AI Studio</p>
                      <p className="font-serif italic text-gray-800 text-lg">Your Bespoke Style</p>
                    </div>
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = resultImg!;
                        link.download = 'formysis-bespoke-look.png';
                        link.click();
                      }}
                      className="bg-black text-white px-10 py-4 text-[11px] tracking-[0.3em] hover:bg-[#d4a3a3] transition-colors shadow-lg"
                    >
                      下載儲存作品
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* 靈感展示牆 */}
            <div className="mt-32 space-y-16">
              <div className="text-center space-y-4">
                <h3 className="font-serif text-4xl italic">Editorial Inspiration</h3>
                <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400">風格靈感櫥窗</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden shadow-sm translate-y-8">
                  <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" alt="Inspiration 1" />
                </div>
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1539109132314-34759616717d?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" alt="Inspiration 2" />
                </div>
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden shadow-sm translate-y-12">
                  <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" alt="Inspiration 3" />
                </div>
              </div>
            </div>

            {/* 品牌理念文字 */}
            <div className="mt-32 text-center max-w-xl mx-auto border-t border-gray-100 pt-16">
              <p className="text-[11px] leading-loose text-gray-400 tracking-[0.25em] uppercase px-4">
                포마이시스는 'for my sister', 언니의 웨딩 드레스를 준비하는 마음을 의미하는 퍼블릭 웨딩 브랜드이다.
                클래식하고 미니멀한 패턴에 페미닌한 디테일을 더하여 MODERN & CITY WEDDING 이미지를 구현하고 있다.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-16 border-t border-gray-100 text-center bg-white">
        <p className="text-[10px] uppercase tracking-[0.6em] text-gray-300">© 2024 FOR MY SIS COLLECTIVE. 版權所有。</p>
      </footer>

      {(step === 'analyzing_user' || step === 'analyzing_cloth' || step === 'generating') && (
        <ProcessingOverlay step={step} />
      )}
    </div>
  );
};

export default App;
