
import { ImageToTextResponse, TextToImageResponse, ApiError } from '../types';

const BASE_URL = 'https://gemini-for-student.annchen1982.workers.dev';

export const handleApiError = (status: number): string => {
  switch (status) {
    case 401:
      return "驗證失敗：請檢查學號格式是否正確 (Ex: st_A...)";
    case 404:
      return "系統錯誤：API 路徑不存在，請聯繫管理員。";
    case 405:
      return "請求錯誤：請使用 POST 方法。";
    case 500:
      return "生成失敗：伺服器內部錯誤或圖片格式不支援，請重試。";
    default:
      return `未知錯誤 (${status})，請稍後再試。`;
  }
};

export const imageToText = async (
  studentId: string,
  base64Image: string,
  prompt: string
): Promise<string> => {
  const response = await fetch(`${BASE_URL}/image-to-text`, {
    method: 'POST',
    headers: {
      'Authorization': `st_${studentId}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    throw { status: response.status, message: handleApiError(response.status) } as ApiError;
  }

  const data: ImageToTextResponse = await response.json();
  return data.candidates[0].content.parts[0].text;
};

export const textToImage = async (
  studentId: string,
  prompt: string
): Promise<string> => {
  const response = await fetch(`${BASE_URL}/text-to-image`, {
    method: 'POST',
    headers: {
      'Authorization': `st_${studentId}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    })
  });

  if (!response.ok) {
    throw { status: response.status, message: handleApiError(response.status) } as ApiError;
  }

  const data: TextToImageResponse = await response.json();
  return data.candidates[0].content.parts[0].inline_data.data;
};
