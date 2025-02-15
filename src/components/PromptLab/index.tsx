import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { generateWithClaude } from '@/services/claude';
import { PromptEditor } from './PromptEditor';
import { DataViewer } from './DataViewer';
import { Preview } from './Preview';

interface PromptLabProps {
  sectionId: string;
  sectionData: any;
  defaultPrompt?: string;
  onGenerate?: (content: string) => void;
}

export function PromptLab({ 
  sectionId,
  sectionData,
  defaultPrompt = '',
  onGenerate
}: PromptLabProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const result = await generateWithClaude(prompt, {
        cacheKey: `${sectionId}-${JSON.stringify(sectionData)}`,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setGeneratedContent(result.content);
        onGenerate?.(result.content);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full h-full">
      <Tabs defaultValue="editor" className="w-full">
        <TabsList>
          <TabsTrigger value="editor">Prompt Editor</TabsTrigger>
          <TabsTrigger value="data">Section Data</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor">
          <PromptEditor
            value={prompt}
            onChange={setPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            error={error}
          />
        </TabsContent>

        <TabsContent value="data">
          <DataViewer data={sectionData} />
        </TabsContent>

        <TabsContent value="preview">
          <Preview content={generatedContent} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}