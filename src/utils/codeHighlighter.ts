
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

// Map of supported languages
export const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'jsx', label: 'JSX' },
  { value: 'tsx', label: 'TSX' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
];

// Function to highlight code based on language
export const highlightCode = (code: string, language: string): string => {
  try {
    // Get the language grammar
    const grammar = languages[language] || languages.javascript;
    // Return highlighted HTML
    return highlight(code, grammar, language);
  } catch (error) {
    console.error('Error highlighting code:', error);
    return code;
  }
};

// Function to add line numbers to code
export const addLineNumbers = (code: string): string => {
  const lines = code.split('\n');
  return lines.map((line, index) => 
    `<span class="line-number">${index + 1}</span>${line}`
  ).join('\n');
};
