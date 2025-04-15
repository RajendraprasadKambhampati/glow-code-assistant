
import React from 'react';
import CodeEditor from '@/components/CodeEditor';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background py-8 px-4">
      <div className="flex-1 flex flex-col">
        <header className="container mx-auto mb-8">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Glow Code Assistant
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            AI-powered code editor with intelligent suggestions and real-time analysis
          </p>
        </header>
        
        <main className="container mx-auto flex-1 flex flex-col">
          <CodeEditor initialCode="// Welcome to Glow Code Assistant
// Start typing to get AI-powered suggestions

function greeting(name) {
  return `Hello, ${name}!`;
}

// Try writing some code and use the AI tools on the right" />
        </main>
        
        <footer className="container mx-auto mt-8 py-4 border-t border-border">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Glow Code Assistant
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Powered by Groq</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
