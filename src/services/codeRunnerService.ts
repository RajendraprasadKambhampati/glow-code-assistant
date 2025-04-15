
// Service for running code
import { toast } from "@/components/ui/use-toast";

// Types for the code runner
export interface CodeRunResult {
  output: string;
  error: string | null;
  executionTime: number;
}

interface LanguageConfig {
  defaultCode: string;
  runCommand: string;
}

// Supported languages with default code samples
export const supportedRuntimeLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
];

export const languageConfigs: Record<string, LanguageConfig> = {
  javascript: {
    defaultCode: 'console.log("Hello, World!");',
    runCommand: 'node',
  },
  python: {
    defaultCode: 'print("Hello, World!")',
    runCommand: 'python',
  },
  java: {
    defaultCode: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
    runCommand: 'javac Main.java && java Main',
  },
};

// Mock function that would be replaced with actual API call
export const runCode = async (code: string, language: string): Promise<CodeRunResult> => {
  // This is where we would make an API call to a code execution service
  // For demo purposes, we'll return mock data
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate execution delay
  
  // Demo logic to "run" different languages
  let output = '';
  let error = null;
  let executionTime = Math.random() * 0.5 + 0.1; // Random time between 0.1 and 0.6 seconds
  
  try {
    if (language === 'javascript') {
      // Simple processing for JavaScript
      if (code.includes('console.log')) {
        // Extract content from console.log
        const matches = code.match(/console\.log\(['"](.*)['"].*\)/g);
        if (matches) {
          output = matches.map(match => {
            const content = match.match(/console\.log\(['"](.*)['"].*\)/);
            return content ? content[1] : '';
          }).join('\n');
        } else {
          output = "No output";
        }
      } else if (code.includes('throw')) {
        error = "Uncaught Error: " + (code.match(/throw.*['"](.*)['"]/)?.[1] || "Error thrown");
      }
    } else if (language === 'python') {
      // Simple processing for Python
      if (code.includes('print')) {
        // Extract content from print
        const matches = code.match(/print\(['"](.*)['"].*\)/g);
        if (matches) {
          output = matches.map(match => {
            const content = match.match(/print\(['"](.*)['"].*\)/);
            return content ? content[1] : '';
          }).join('\n');
        } else {
          output = "No output";
        }
      } else if (code.includes('raise')) {
        error = "Traceback (most recent call last):\n  File \"<string>\", line 1\n" + 
                (code.match(/raise.*['"](.*)['"]/)?.[1] || "Exception raised");
      }
    } else if (language === 'java') {
      // Simple processing for Java
      if (code.includes('System.out.println')) {
        // Extract content from System.out.println
        const matches = code.match(/System\.out\.println\(['"](.*)['"].*\)/g);
        if (matches) {
          output = matches.map(match => {
            const content = match.match(/System\.out\.println\(['"](.*)['"].*\)/);
            return content ? content[1] : '';
          }).join('\n');
        } else {
          output = "No output";
        }
      } else if (code.includes('throw new')) {
        error = "Exception in thread \"main\" java.lang.Exception: " + 
                (code.match(/throw new.*['"](.*)['"]/)?.[1] || "Exception thrown");
      }
    }
    
    // Introduce random errors occasionally for demo purposes
    if (Math.random() < 0.05 && !error) {
      error = `Runtime error: ${language} interpreter crashed unexpectedly.`;
    }
    
    return { output, error, executionTime };
  } catch (e) {
    console.error("Error running code:", e);
    return { 
      output: '', 
      error: "An unexpected error occurred while running your code.", 
      executionTime: 0 
    };
  }
};
