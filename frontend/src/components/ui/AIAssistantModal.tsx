import React, { useState } from 'react';
import { Button } from './Button';
import { Sparkles, Loader2, X } from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import { useNavigate } from 'react-router-dom';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState("");
  const { generate, isGenerating } = useAI();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    const result = await generate(prompt);
    if (result) {
      // Close modal and navigate to New Entry prefilled with result
      onClose();
      navigate('/diary/new', { state: { aiGenerated: true, ...result } });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-xl border border-border shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary-bg/30">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Sparkles size={20} />
            <h2>Ollama AI Assistant</h2>
          </div>
          <button onClick={onClose} className="text-secondary-text hover:text-text p-1 rounded-md hover:bg-secondary-bg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-sm text-secondary-text">
            Describe what you want to write about, and the local AI will draft a complete diary entry for you.
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., A rainy day spent reading a good book..."
            className="w-full h-32 p-3 bg-secondary-bg border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-secondary-text/50"
            disabled={isGenerating}
          />
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-secondary-bg/30">
          <Button variant="outline" onClick={onClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="gap-2">
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isGenerating ? "Generating..." : "Generate Entry"}
          </Button>
        </div>
      </div>
    </div>
  );
};
