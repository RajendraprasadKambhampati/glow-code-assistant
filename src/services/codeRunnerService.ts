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
      // Enhanced processing for JavaScript with data type support
      if (code.includes('console.log')) {
        const result = processJavaScriptCode(code);
        output = result.output;
        error = result.error;
      }
    } else if (language === 'python') {
      // Enhanced processing for Python with data type support
      if (code.includes('print')) {
        const result = processPythonCode(code);
        output = result.output;
        error = result.error;
      }
    } else if (language === 'java') {
      // Enhanced processing for Java with data type support
      if (code.includes('System.out.println')) {
        const result = processJavaCode(code);
        output = result.output;
        error = result.error;
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

// Process JavaScript code with advanced data type support
const processJavaScriptCode = (code: string) => {
  let output = '';
  let error = null;
  
  try {
    // Create a sandbox to run the code (simulated)
    const sandbox = {};
    const console = {
      log: (...args: any[]) => {
        output += args.map(arg => {
          if (typeof arg === 'object') {
            return JSON.stringify(arg, null, 2);
          } else {
            return String(arg);
          }
        }).join(' ') + '\n';
      }
    };
    
    // Mock execution by extracting values
    const regex = /console\.log\((.*)\)/g;
    const matches = code.matchAll(regex);
    
    for (const match of Array.from(matches)) {
      const content = match[1];
      
      // Handle different data types
      if (content.startsWith('"') || content.startsWith("'")) {
        // String type
        const stringMatch = content.match(/["'](.*?)["']/);
        if (stringMatch) output += stringMatch[1] + '\n';
      } else if (!isNaN(Number(content))) {
        // Number type
        output += content + '\n';
      } else if (content.includes('[') && content.includes(']')) {
        // Array type
        try {
          // Simple array parsing for demonstration
          const arrayStr = content.replace(/\s/g, '');
          const items = arrayStr.substring(1, arrayStr.length - 1).split(',');
          output += '[' + items.join(', ') + ']\n';
        } catch (e) {
          output += 'Array: [parsable array]\n';
        }
      } else if (content.includes('{') && content.includes('}')) {
        // Object type
        output += 'Object: {parsed object properties}\n';
      } else if (content === 'true' || content === 'false') {
        // Boolean type
        output += content + '\n';
      } else if (content === 'null' || content === 'undefined') {
        // Null/Undefined type
        output += content + '\n';
      } else {
        // Variable or expression
        output += 'Variable: ' + content + '\n';
      }
    }
    
    // Look for thrown errors
    if (code.includes('throw')) {
      const errorMatch = code.match(/throw\s+(?:new\s+Error\s*\(\s*)?["'](.*)["']/);
      if (errorMatch) {
        error = "Error: " + errorMatch[1];
      } else {
        error = "Error thrown";
      }
    }
    
  } catch (e) {
    error = `Execution error: ${e.message}`;
  }
  
  return { output, error };
};

// Process Python code with advanced data type support
const processPythonCode = (code: string) => {
  let output = '';
  let error = null;
  
  try {
    // Enhanced processing for print statements
    const regex = /print\((.*)\)/g;
    const matches = code.matchAll(regex);
    
    for (const match of Array.from(matches)) {
      const content = match[1];
      
      // Handle different data types and raw values
      const cleanContent = content.replace(/^['"]|['"]$/g, '');
      
      output += cleanContent + '\n';
    }
    
    // Look for raised exceptions
    if (code.includes('raise')) {
      const errorMatch = code.match(/raise\s+[\w.]+\s*\(\s*["'](.*)["']/);
      if (errorMatch) {
        error = "Exception: " + errorMatch[1];
      } else {
        error = "Exception raised";
      }
    }
    
  } catch (e) {
    error = `Execution error: ${e.message}`;
  }
  
  return { output, error };
};

// Process Java code with advanced data type support
const processJavaCode = (code: string) => {
  let output = '';
  let error = null;
  
  try {
    // Mock execution by extracting values
    const regex = /System\.out\.println\((.*)\);/g;
    const matches = code.matchAll(regex);
    
    for (const match of Array.from(matches)) {
      const content = match[1];
      
      // Handle different data types
      if (content.startsWith('"') || content.startsWith("'")) {
        // String type
        const stringMatch = content.match(/["'](.*?)["']/);
        if (stringMatch) output += stringMatch[1] + '\n';
      } else if (!isNaN(Number(content))) {
        // Number type
        output += content + '\n';
      } else if (content.includes('new') && content.includes('[]')) {
        // Array type
        output += '[parsed array]\n';
      } else if (content.includes('new') && content.includes('()')) {
        // Object type
        output += '{parsed object}\n';
      } else if (content === 'true' || content === 'false') {
        // Boolean type
        output += content + '\n';
      } else if (content === 'null') {
        // Null type
        output += 'null\n';
      } else {
        // Variable or expression
        output += 'Variable: ' + content + '\n';
      }
    }
    
    // Look for thrown exceptions
    if (code.includes('throw')) {
      const errorMatch = code.match(/throw\s+new\s+[\w.]+\s*\(\s*["'](.*)["']/);
      if (errorMatch) {
        error = "Exception: " + errorMatch[1];
      } else {
        error = "Exception thrown";
      }
    }
    
  } catch (e) {
    error = `Execution error: ${e.message}`;
  }
  
  return { output, error };
};

// Function to execute terminal commands through AI assistance
export const executeCommand = async (command: string): Promise<string> => {
  // This would be connected to a secure backend in a real implementation
  // For demo purposes, we'll simulate command execution
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate command outputs for demo
  if (command.includes('install') || command.includes('npm') || command.includes('pip')) {
    return `Executing: ${command}\n[######################] 100%\nPackage installed successfully!`;
  } else if (command.includes('ls') || command.includes('dir')) {
    return 'index.html\nscript.js\nstyle.css\nREADME.md';
  } else if (command.includes('git')) {
    return `Git command executed: ${command}\nOK`;
  } else {
    return `Command executed: ${command}\nExecution complete.`;
  }
};
