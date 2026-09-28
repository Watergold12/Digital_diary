import { apiClient } from './client';

export interface AIGenerateRequest {
  prompt: string;
  model?: string;
}

export interface AIGenerateResponse {
  title: string;
  content: string;
  tags: string[];
}

export const aiApi = {
  generateEntry: async (request: AIGenerateRequest): Promise<AIGenerateResponse> => {
    return await apiClient.post<AIGenerateResponse>('/api/ai/generate', request);
  }
};
