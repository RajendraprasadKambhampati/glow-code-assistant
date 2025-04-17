
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { WandSparklesIcon } from 'lucide-react';

interface CodeSuggestionProps {
  code: string;
  language: string;
  cursorPosition: { line: number; column: number };
  onApplySuggestion: (suggestion: string) => void;
}

const CodeSuggestion: React.FC<CodeSuggestionProps> = ({ 
  code,
  language,
  cursorPosition,
  onApplySuggestion
}) => {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const generateSuggestion = async () => {
      // Skip if code is empty or too short
      if (!code || code.length < 3) {
        setSuggestion(null);
        return;
      }
      
      // Debounce to prevent too many API calls
      const timeoutId = setTimeout(async () => {
        setIsLoading(true);
        try {
          // Get current line
          const lines = code.split('\n');
          const currentLine = lines[cursorPosition.line - 1] || '';
          
          // Skip if current line is empty or a comment
          if (!currentLine.trim() || 
              (language === 'javascript' && currentLine.trim().startsWith('//')) ||
              (language === 'python' && currentLine.trim().startsWith('#'))) {
            setSuggestion(null);
            return;
          }
          
          // This would be an actual API call in a real implementation
          // Here we're generating mock suggestions based on simple patterns
          let suggestedCode = '';
          
          // Simulate some basic pattern matching for different languages
          if (language === 'javascript') {
            if (currentLine.includes('function') && !currentLine.includes('{')) {
              suggestedCode = '() {\n  // Function body\n  return result;\n}';
            } else if (currentLine.includes('if') && !currentLine.includes('{')) {
              suggestedCode = ' (condition) {\n  // If body\n}';
            } else if (currentLine.includes('for') && !currentLine.includes('{')) {
              suggestedCode = ' (let i = 0; i < array.length; i++) {\n  // For loop body\n}';
            } else if (currentLine.includes('console.l')) {
              suggestedCode = 'og()';
            }
          } else if (language === 'python') {
            if (currentLine.includes('def') && !currentLine.includes(':')) {
              suggestedCode = '(parameters):\n    # Function body\n    return result';
            } else if (currentLine.includes('if') && !currentLine.includes(':')) {
              suggestedCode = ' condition:\n    # If body';
            } else if (currentLine.includes('for') && !currentLine.includes(':')) {
              suggestedCode = ' item in items:\n    # For loop body';
            } else if (currentLine.includes('pri')) {
              suggestedCode = 'nt()';
            } else if (currentLine.includes('import')) {
              suggestedCode = ' numpy as np';
            }
          } else if (language === 'java') {
            if (currentLine.includes('public class') && !currentLine.includes('{')) {
              suggestedCode = ' {\n    public static void main(String[] args) {\n        // Main method\n    }\n}';
            } else if (currentLine.includes('if') && !currentLine.includes('{')) {
              suggestedCode = ' (condition) {\n    // If body\n}';
            } else if (currentLine.includes('for') && !currentLine.includes('{')) {
              suggestedCode = ' (int i = 0; i < array.length; i++) {\n    // For loop body\n}';
            } else if (currentLine.includes('System.out.')) {
              suggestedCode = 'println()';
            }
          }
          
          // Only set suggestion if we have something
          if (suggestedCode) {
            setSuggestion(suggestedCode);
          } else {
            setSuggestion(null);
          }
        } catch (error) {
          console.error('Error generating suggestion:', error);
          setSuggestion(null);
        } finally {
          setIsLoading(false);
        }
      }, 500); // 500ms debounce
      
      return () => clearTimeout(timeoutId);
    };
    
    generateSuggestion();
  }, [code, cursorPosition, language]);
  
  if (!suggestion || isLoading) {
    return null;
  }
  
  return (
    <div className="p-3 bg-secondary rounded-b-md border-t border-primary/30 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium flex items-center">
          <WandSparklesIcon className="h-4 w-4 mr-1 text-primary animate-pulse-subtle" />
          AI Suggestion
        </span>
        <Button size="sm" variant="default" onClick={() => onApplySuggestion(suggestion)}>
          Apply
        </Button>
      </div>
      <pre className="p-2 bg-black/30 rounded text-sm overflow-x-auto">
        {suggestion}
      </pre>
    </div>
  );
};

export default CodeSuggestion;
