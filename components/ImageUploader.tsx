
import React from 'react';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageSelect: (base64: string, file: File) => void;
  previewUrl: string | null;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageSelect, previewUrl, disabled }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("圖片大小不能超過 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.replace(/^data:image\/\w+;base64,/, "");
      onImageSelect(base64, file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 pl-1">{label}</label>
      <div 
        className={`relative overflow-hidden flex items-center justify-center bg-white transition-all duration-500
          ${previewUrl ? 'shadow-sm' : 'border-[1px] border-gray-200 hover:border-[#d4a3a3]'} 
          ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
        style={{ height: '240px' }}
      >
        {previewUrl ? (
          <div className="w-full h-full p-2">
            <img src={previewUrl} alt="預覽" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="flex flex-col items-center group">
            <div className="w-8 h-[1px] bg-gray-200 mb-4 group-hover:bg-[#d4a3a3] transition-colors"></div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 group-hover:text-[#d4a3a3] transition-colors">選擇圖片</p>
          </div>
        )}
        <input 
          id={id}
          type="file" 
          accept="image/jpeg, image/png" 
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
