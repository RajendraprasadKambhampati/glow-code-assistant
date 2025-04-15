
import React from 'react';
import CodeEditor from '@/components/CodeEditor';
import { motion } from 'framer-motion';
import { Code2, Zap, Gem } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background py-8 px-4 overflow-hidden">
      <div className="flex-1 flex flex-col relative">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-purple-900/10 opacity-50 animate-pulse"></div>
        
        {/* Header with Animated Elements */}
        <motion.header 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="container mx-auto mb-8 relative z-10"
        >
          <motion.h1 
            className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Glow Code Assistant
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center text-muted-foreground mt-4 flex items-center justify-center space-x-2"
          >
            <Zap className="text-primary" />
            <span>AI-powered code editor with intelligent suggestions</span>
            <Code2 className="text-primary" />
          </motion.p>
        </motion.header>
        
        {/* Main Content with Animated Code Editor */}
        <motion.main 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="container mx-auto flex-1 flex flex-col relative z-10"
        >
          <div className="rounded-xl overflow-hidden shadow-2xl border border-primary/20">
            <CodeEditor initialCode="// Welcome to Glow Code Assistant
// Start typing to get AI-powered suggestions

function greeting(name) {
  return `Hello, ${name}!`;
}

// Try writing some code and use the AI tools on the right" />
          </div>
        </motion.main>
        
        {/* Footer with Animated Elements */}
        <motion.footer 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="container mx-auto mt-8 py-4 border-t border-border relative z-10"
        >
          <div className="flex justify-between items-center">
            <motion.p 
              whileHover={{ scale: 1.05 }}
              className="text-sm text-muted-foreground flex items-center"
            >
              <Gem className="mr-2 text-primary" />
              © 2025 Glow Code Assistant
            </motion.p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Powered by Groq</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
