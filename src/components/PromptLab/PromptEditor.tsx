import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
}

export function PromptEditor({
  value,
  onChange,
  onGenerate,
  isGenerating,
  error
}: PromptEditorProps) {
  return (
    <div className="space-y-4 p-4">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your prompt here..."
        className="min-h-[400px] font-mono"
      />
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={onGenerate}
          disabled={isGenerating || !value.trim()}
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate
        </Button>
      </div>
    </div>
  );
}