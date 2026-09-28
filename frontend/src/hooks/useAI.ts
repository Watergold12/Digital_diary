import { useState } from 'react';
import { aiApi, AIGenerateResponse } from '../api/ai';
import { useToast } from '../components/ui/Toast';

export const useAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generate = async (prompt: string, model: string = "llama3.2"): Promise<AIGenerateResponse | null> => {
    setIsGenerating(true);
    try {
      const response = await aiApi.generateEntry({ prompt, model });
      toast("AI generated your entry successfully!", "success");
      return response;
    } catch (err) {
      console.error(err);
      toast("Failed to generate entry with AI. Make sure Ollama is running.", "error");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating };
};
