"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PromptGenerator from "./PromptGenerator";
import PromptVisualizer from "./PromptVisualizer";
import PromptTester from "./PromptTester";
import SampleDataViewer from "./SampleDataViewer";

export default function PromptTestingUI() {
  return (
    <Tabs defaultValue="generator" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="generator">Prompt Generator</TabsTrigger>
        <TabsTrigger value="visualizer">Template Visualizer</TabsTrigger>
        <TabsTrigger value="tester">Test Runner</TabsTrigger>
        <TabsTrigger value="sample-data">Sample Data</TabsTrigger>
      </TabsList>
      
      <TabsContent value="generator">
        <PromptGenerator />
      </TabsContent>
      
      <TabsContent value="visualizer">
        <PromptVisualizer />
      </TabsContent>
      
      <TabsContent value="tester">
        <PromptTester />
      </TabsContent>
      
      <TabsContent value="sample-data">
        <SampleDataViewer />
      </TabsContent>
    </Tabs>
  );
}
