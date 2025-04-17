
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { executeCommand } from '@/services/codeRunnerService';
import { toast } from "@/components/ui/use-toast";
import { SendIcon, Terminal, Code, Play, XIcon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface AITerminalAssistantProps {
  onCodeGenerated: (code: string) => void;
  language: string;
  onClose: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: 'code' | 'command' | 'text';
}

const AITerminalAssistant: React.FC<AITerminalAssistantProps> = ({
  onCodeGenerated,
  language,
  onClose
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your coding assistant. I can help you write code, explain concepts, or run terminal commands. What can I help you with today?`,
      type: 'text'
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      type: 'text'
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Determine if the message is a command request
      const isCommand = message.startsWith('/') || 
                        message.toLowerCase().includes('run ') || 
                        message.toLowerCase().includes('execute ');
      
      // Determine if the message is a code generation request
      const isCodeRequest = message.toLowerCase().includes('generate') || 
                           message.toLowerCase().includes('write code') || 
                           message.toLowerCase().includes('create a function') ||
                           message.toLowerCase().includes('write a function');
      
      if (isCommand) {
        // Extract the command
        let command = message;
        if (message.startsWith('/')) {
          command = message.substring(1);
        } else if (message.toLowerCase().includes('run ')) {
          command = message.substring(message.toLowerCase().indexOf('run ') + 4);
        } else if (message.toLowerCase().includes('execute ')) {
          command = message.substring(message.toLowerCase().indexOf('execute ') + 8);
        }
        
        // Execute the command
        const result = await executeCommand(command.trim());
        
        // Add the command response to chat
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: result,
          type: 'command'
        }]);
        
        toast({
          title: "Command executed",
          description: "The command has been executed successfully."
        });
      } else if (isCodeRequest) {
        // Generate code based on the request
        // This would be connected to a real AI service in production
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        let generatedCode = '';
        
        // Generate simple code examples based on language and user message
        if (language === 'javascript') {
          if (message.includes('function')) {
            generatedCode = `function processData(data) {\n  // Validate input\n  if (!data || typeof data !== 'object') {\n    throw new Error('Invalid data format');\n  }\n  \n  // Process the data\n  const result = {\n    processed: true,\n    timestamp: new Date().toISOString(),\n    summary: data.items ? data.items.length + ' items processed' : 'No items found'\n  };\n  \n  console.log('Processing complete:', result);\n  return result;\n}`;
          } else if (message.includes('class')) {
            generatedCode = `class DataProcessor {\n  constructor(config = {}) {\n    this.config = {\n      debug: false,\n      timeout: 1000,\n      ...config\n    };\n  }\n  \n  process(data) {\n    if (this.config.debug) {\n      console.log('Processing data:', data);\n    }\n    \n    // Processing logic here\n    return {\n      processed: true,\n      result: data\n    };\n  }\n}`;
          } else {
            generatedCode = `// Simple data processing example\nconst data = [\n  { id: 1, name: 'Item 1', value: 10 },\n  { id: 2, name: 'Item 2', value: 20 },\n  { id: 3, name: 'Item 3', value: 30 }\n];\n\n// Filter and map the data\nconst processedData = data\n  .filter(item => item.value > 15)\n  .map(item => ({\n    identifier: item.id,\n    label: item.name.toUpperCase(),\n    doubled: item.value * 2\n  }));\n\nconsole.log('Processed data:', processedData);`;
          }
        } else if (language === 'python') {
          if (message.includes('function')) {
            generatedCode = `def process_data(data):\n    \"\"\"Process the input data and return a formatted result.\n    \n    Args:\n        data (dict): The input data to process\n        \n    Returns:\n        dict: The processed result\n    \"\"\"\n    # Validate input\n    if not data or not isinstance(data, dict):\n        raise ValueError("Invalid data format")\n    \n    # Process the data\n    result = {\n        "processed": True,\n        "timestamp": import datetime; datetime.datetime.now().isoformat(),\n        "summary": f"{len(data.get('items', []))} items processed" if data.get('items') else "No items found"\n    }\n    \n    print("Processing complete:", result)\n    return result`;
          } else if (message.includes('class')) {
            generatedCode = `class DataProcessor:\n    def __init__(self, config=None):\n        self.config = {\n            "debug": False,\n            "timeout": 1000,\n        }\n        if config:\n            self.config.update(config)\n    \n    def process(self, data):\n        if self.config["debug"]:\n            print("Processing data:", data)\n        \n        # Processing logic here\n        return {\n            "processed": True,\n            "result": data\n        }`;
          } else {
            generatedCode = `# Simple data processing example\ndata = [\n    {"id": 1, "name": "Item 1", "value": 10},\n    {"id": 2, "name": "Item 2", "value": 20},\n    {"id": 3, "name": "Item 3", "value": 30}\n]\n\n# Filter and map the data\nprocessed_data = [\n    {\n        "identifier": item["id"],\n        "label": item["name"].upper(),\n        "doubled": item["value"] * 2\n    }\n    for item in data if item["value"] > 15\n]\n\nprint("Processed data:", processed_data)`;
          }
        } else if (language === 'java') {
          if (message.includes('function') || message.includes('method')) {
            generatedCode = `public Map<String, Object> processData(Map<String, Object> data) {\n    // Validate input\n    if (data == null || data.isEmpty()) {\n        throw new IllegalArgumentException("Invalid data format");\n    }\n    \n    // Process the data\n    Map<String, Object> result = new HashMap<>();\n    result.put("processed", true);\n    result.put("timestamp", new Date().toString());\n    \n    List<?> items = (List<?>) data.get("items");\n    String summary = items != null ? items.size() + " items processed" : "No items found";\n    result.put("summary", summary);\n    \n    System.out.println("Processing complete: " + result);\n    return result;\n}`;
          } else if (message.includes('class')) {
            generatedCode = `public class DataProcessor {\n    private Map<String, Object> config;\n    \n    public DataProcessor() {\n        this(new HashMap<>());\n    }\n    \n    public DataProcessor(Map<String, Object> config) {\n        this.config = new HashMap<>();\n        this.config.put("debug", false);\n        this.config.put("timeout", 1000);\n        \n        if (config != null) {\n            this.config.putAll(config);\n        }\n    }\n    \n    public Map<String, Object> process(Map<String, Object> data) {\n        if ((Boolean) this.config.get("debug")) {\n            System.out.println("Processing data: " + data);\n        }\n        \n        // Processing logic here\n        Map<String, Object> result = new HashMap<>();\n        result.put("processed", true);\n        result.put("result", data);\n        return result;\n    }\n}`;
          } else {
            generatedCode = `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Map<String, Object>> data = new ArrayList<>();\n        \n        Map<String, Object> item1 = new HashMap<>();\n        item1.put("id", 1);\n        item1.put("name", "Item 1");\n        item1.put("value", 10);\n        data.add(item1);\n        \n        Map<String, Object> item2 = new HashMap<>();\n        item2.put("id", 2);\n        item2.put("name", "Item 2");\n        item2.put("value", 20);\n        data.add(item2);\n        \n        Map<String, Object> item3 = new HashMap<>();\n        item3.put("id", 3);\n        item3.put("name", "Item 3");\n        item3.put("value", 30);\n        data.add(item3);\n        \n        // Filter and map the data\n        List<Map<String, Object>> processedData = new ArrayList<>();\n        \n        for (Map<String, Object> item : data) {\n            int value = (int) item.get("value");\n            if (value > 15) {\n                Map<String, Object> processedItem = new HashMap<>();\n                processedItem.put("identifier", item.get("id"));\n                processedItem.put("label", ((String) item.get("name")).toUpperCase());\n                processedItem.put("doubled", value * 2);\n                processedData.add(processedItem);\n            }\n        }\n        \n        System.out.println("Processed data: " + processedData);\n    }\n}`;
          }
        }
        
        // Add the generated code to chat
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: generatedCode,
          type: 'code'
        }]);
        
        toast({
          title: "Code generated",
          description: "AI has generated code based on your request."
        });
      } else {
        // Regular conversation - simulate AI response
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
        
        // Generate a contextual response based on the user's message
        let response = '';
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
          response = `Hello! How can I help with your ${language} code today?`;
        } else if (lowerMessage.includes('thank')) {
          response = `You're welcome! Feel free to ask if you need more help.`;
        } else if (lowerMessage.includes('error') || lowerMessage.includes('bug')) {
          response = `I can help troubleshoot errors. Could you share the specific error message or code snippet you're working with?`;
        } else if (lowerMessage.includes('how to') || lowerMessage.includes('how do')) {
          response = `That's a good question about ${message.substring(message.toLowerCase().indexOf('how')).trim()}. 
          
To address this, I'd recommend the following approach:
1. Break down the problem into smaller steps
2. Consider using the appropriate data structures
3. Test your solution with different inputs

Would you like me to generate some example code for this task?`;
        } else {
          response = `I understand you're asking about "${message}". This is an interesting topic in ${language} development.

If you'd like, I can:
- Generate some example code for this
- Explain the concept in more detail
- Show you how to implement this functionality

Just let me know which option you prefer.`;
        }
        
        // Add AI response to chat
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: response,
          type: 'text'
        }]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message to chat
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        type: 'text'
      }]);
      
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // Focus input after processing
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleUseCode = (code: string) => {
    onCodeGenerated(code);
    toast({
      title: "Code applied",
      description: "The generated code has been applied to the editor."
    });
  };
  
  return (
    <Card className="flex flex-col h-full overflow-hidden border-primary/10">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <h3 className="font-medium">AI Terminal Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {chatHistory.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-lg p-3 ${
                msg.role === 'user' 
                  ? 'bg-assistant-bg text-white' 
                  : theme === 'dark'
                    ? 'bg-secondary/70 text-foreground'
                    : 'bg-assistant-light text-foreground'
              }`}
            >
              {msg.type === 'code' ? (
                <div>
                  <pre className={`text-xs font-mono overflow-x-auto p-2 ${
                    theme === 'dark' ? 'bg-black/40' : 'bg-black/10'
                  } rounded mb-2`}>
                    {msg.content}
                  </pre>
                  <div className="flex justify-end gap-2 mt-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-xs"
                      onClick={() => handleUseCode(msg.content)}
                    >
                      <Code className="h-3 w-3 mr-1" />
                      Use Code
                    </Button>
                  </div>
                </div>
              ) : msg.type === 'command' ? (
                <pre className={`text-xs font-mono overflow-x-auto p-2 ${
                  theme === 'dark' ? 'bg-black/40' : 'bg-black/10'
                } rounded`}>
                  {msg.content}
                </pre>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {isLoading && (
          <div className="flex justify-start">
            <div className={`rounded-lg p-3 ${
              theme === 'dark' ? 'bg-secondary/70' : 'bg-assistant-light'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Ask for help, generate code, or run commands with /..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
            className="bg-assistant-bg hover:bg-assistant-hover text-white"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Try: "Generate a function to process JSON data" or "/npm install express"</p>
        </div>
      </div>
    </Card>
  );
};

export default AITerminalAssistant;
