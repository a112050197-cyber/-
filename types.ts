
export type AppStep = 'setup' | 'analyzing_user' | 'analyzing_cloth' | 'generating' | 'success' | 'error';

export interface ImageToTextResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface TextToImageResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        inline_data: {
          mime_type: string;
          data: string;
        };
      }>;
    };
  }>;
}

export interface ApiError {
  status: number;
  message: string;
}
