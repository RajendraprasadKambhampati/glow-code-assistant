
import React, { useState } from 'react';
import { runCode, supportedRuntimeLanguages, languageConfigs, CodeRunResult } from '@/services/codeRunnerService';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { PlayIcon, RotateCwIcon, ClipboardCopyIcon } from "lucide-react";

interface CodeRunnerProps {
  code: string;
  onLanguageChange?: (language: string) => void;
}

const CodeRunner: React.FC<CodeRunnerProps> = ({ 
  code,
  onLanguageChange
}) => {
  const [language, setLanguage] = useState<string>('javascript');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<CodeRunResult | null>(null);
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    onLanguageChange?.(value);
  };
  
  const handleRunCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to run",
        description: "Please enter some code first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRunning(true);
    setResult(null);
    
    try {
      const runResult = await runCode(code, language);
      setResult(runResult);
      
      if (runResult.error) {
        toast({
          title: "Code execution error",
          description: "Your code ran with errors. Check the console output.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Code executed successfully",
          description: `Execution time: ${runResult.executionTime.toFixed(3)}s`,
        });
      }
    } catch (error) {
      console.error("Error running code:", error);
      toast({
        title: "Error",
        description: "Failed to run code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const copyOutput = () => {
    if (!result) return;
    
    const textToCopy = result.error ? result.error : result.output;
    navigator.clipboard.writeText(textToCopy);
    
    toast({
      title: "Copied!",
      description: "Output copied to clipboard.",
    });
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {supportedRuntimeLanguages.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="default"
          onClick={handleRunCode}
          disabled={isRunning || !code.trim()}
          className="flex items-center gap-1"
        >
          {isRunning ? (
            <>
              <RotateCwIcon className="h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <PlayIcon className="h-4 w-4" />
              Run Code
            </>
          )}
        </Button>
      </div>
      
      {result && (
        <Card className="mt-4 bg-black/50 border border-primary/25">
          <div className="p-3 flex justify-between items-center border-b border-primary/25">
            <span className="text-sm font-medium">Console Output</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyOutput}
              className="h-8 px-2"
            >
              <ClipboardCopyIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 font-mono text-sm h-[200px] overflow-auto">
            {result.error ? (
              <pre className="text-destructive">{result.error}</pre>
            ) : result.output ? (
              <pre>{result.output}</pre>
            ) : (
              <span className="text-muted-foreground">No output</span>
            )}
          </div>
          <div className="p-2 border-t border-primary/25 text-xs text-muted-foreground flex justify-between">
            <span>Language: {language}</span>
            <span>Execution time: {result.executionTime.toFixed(3)}s</span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CodeRunner;
