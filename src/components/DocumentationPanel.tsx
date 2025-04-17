
import React from 'react';
import { Button } from "@/components/ui/button";
import { XIcon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface DocumentationPanelProps {
  showDocumentation: boolean;
  toggleDocumentation: () => void;
  language: string;
}

const DocumentationPanel: React.FC<DocumentationPanelProps> = ({ 
  showDocumentation, 
  toggleDocumentation,
  language
}) => {
  const { theme } = useTheme();
  
  if (!showDocumentation) return null;
  
  return (
    <div className={`fixed inset-0 bg-black/50 z-50 flex justify-end overflow-hidden`} onClick={(e) => {
      if (e.target === e.currentTarget) toggleDocumentation();
    }}>
      <div 
        className={`w-full max-w-md ${theme === 'light' ? 'bg-white' : 'bg-[#1e1e1e]'} h-full shadow-lg overflow-y-auto animate-slide-in-right`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-[#3e3e42]'} flex justify-between items-center`}>
          <h2 className="text-lg font-semibold">Documentation</h2>
          <Button variant="ghost" size="sm" onClick={toggleDocumentation}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h3 className={`text-md font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              {language.charAt(0).toUpperCase() + language.slice(1)} Documentation
            </h3>
            <p className={`text-sm mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              Quick reference guide for {language} programming language.
            </p>
            <div className={`p-3 rounded ${theme === 'light' ? 'bg-gray-100' : 'bg-[#252526]'}`}>
              <h4 className="font-semibold mb-2">Common functions and syntax</h4>
              <pre className="text-xs font-mono overflow-x-auto">
                {language === 'python' ? (
                  `# Print to console
print("Hello, World!")

# Variables
x = 10
name = "Python"

# Conditional statements
if x > 5:
    print("x is greater than 5")
else:
    print("x is less than or equal to 5")

# Loops
for i in range(5):
    print(i)

# Functions
def greet(name):
    return f"Hello, {name}!"
                  `
                ) : language === 'javascript' ? (
                  `// Print to console
console.log("Hello, World!");

// Variables
let x = 10;
const name = "JavaScript";

// Conditional statements
if (x > 5) {
  console.log("x is greater than 5");
} else {
  console.log("x is less than or equal to 5");
}

// Loops
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// Functions
function greet(name) {
  return \`Hello, \${name}!\`;
}
                  `
                ) : (
                  `// Documentation for ${language} will be shown here.
// This is a placeholder in the demo.
                  `
                )}
              </pre>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className={`text-md font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Keyboard Shortcuts
            </h3>
            <div className={`rounded overflow-hidden border ${theme === 'light' ? 'border-gray-200' : 'border-[#3e3e42]'}`}>
              <table className="w-full text-sm">
                <tbody>
                  <tr className={`${theme === 'light' ? 'bg-gray-50' : 'bg-[#252526]'}`}>
                    <td className="py-2 px-4 border-b border-r border-gray-200">Ctrl + Enter</td>
                    <td className="py-2 px-4 border-b border-gray-200">Run Code</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-r border-gray-200">Ctrl + S</td>
                    <td className="py-2 px-4 border-b border-gray-200">Save Code</td>
                  </tr>
                  <tr className={`${theme === 'light' ? 'bg-gray-50' : 'bg-[#252526]'}`}>
                    <td className="py-2 px-4 border-b border-r border-gray-200">Ctrl + /</td>
                    <td className="py-2 px-4 border-b border-gray-200">Toggle Comment</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-r border-gray-200">Tab</td>
                    <td className="py-2 px-4">Indent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h3 className={`text-md font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              External Resources
            </h3>
            <ul className={`list-disc pl-5 space-y-1 text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              <li><a href="#" className="hover:underline">Official Documentation</a></li>
              <li><a href="#" className="hover:underline">Tutorial for Beginners</a></li>
              <li><a href="#" className="hover:underline">Common Error Solutions</a></li>
              <li><a href="#" className="hover:underline">Best Practices</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPanel;
