
import React, { useRef } from 'react';
import CodeSuggestion from '@/components/CodeSuggestion';
import { useTheme } from '@/hooks/useTheme';

interface CodeEditorPaneProps {
  code: string;
  handleCodeChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  updateCursorPosition: (target: HTMLTextAreaElement) => void;
  cursorPosition: { line: number; column: number };
  language: string;
  handleApplySuggestion: (suggestion: string) => void;
}

const CodeEditorPane: React.FC<CodeEditorPaneProps> = ({ 
  code, 
  handleCodeChange, 
  updateCursorPosition,
  cursorPosition,
  language,
  handleApplySuggestion
}) => {
  const { theme } = useTheme();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full relative">
        <pre className={`absolute inset-0 p-4 font-mono text-sm ${theme === 'light' ? 'bg-white' : 'bg-[#1e1e1e]'} overflow-auto`}>
          <div className="flex">
            <div className={`pr-4 select-none ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} text-right`}>
              {code.split('\n').map((_, i) => (
                <div key={i} className="h-6">{i + 1}</div>
              ))}
            </div>
            <div className="flex-1 relative min-w-0">
              <textarea
                ref={editorRef}
                value={code}
                onChange={handleCodeChange}
                onClick={(e) => updateCursorPosition(e.currentTarget)}
                onKeyUp={(e) => updateCursorPosition(e.currentTarget)}
                className={`w-full h-full ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-transparent text-gray-300'} outline-none resize-none font-mono absolute inset-0`}
                spellCheck="false"
                style={{ lineHeight: '1.5rem' }}
              />
              
              <div className="absolute bottom-0 left-0 w-full">
                <CodeSuggestion
                  code={code}
                  language={language}
                  cursorPosition={cursorPosition}
                  onApplySuggestion={handleApplySuggestion}
                />
              </div>
            </div>
          </div>
        </pre>
      </div>
    </div>
  );
};

export default CodeEditorPane;
