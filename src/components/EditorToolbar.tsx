
import React, { useRef } from 'react';
import { 
  Upload, Save, Copy, Download, Share2, FileText
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from '@/hooks/useTheme';

interface EditorToolbarProps {
  language: string;
  getFileExtension: (lang: string) => string;
  handleRunCode: () => void;
  handleSaveCode: () => void;
  handleCopyCode: () => void;
  handleDownloadCode: () => void;
  handleShareCode: () => void;
  toggleDocumentation: () => void;
  showDocumentation: boolean;
  loading: boolean;
  isUploading: boolean;
  isSharing: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  language,
  getFileExtension,
  handleRunCode,
  handleSaveCode,
  handleCopyCode,
  handleDownloadCode,
  handleShareCode,
  toggleDocumentation,
  showDocumentation,
  loading,
  isUploading,
  isSharing,
  handleFileChange
}) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex items-center ${theme === 'light' ? 'bg-gray-100' : 'bg-[#252526]'} px-4 py-2 text-sm border-b ${theme === 'light' ? 'border-gray-200' : 'border-[#3e3e42]'}`}>
      <div className={`px-4 py-1 ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-[#1e1e1e] text-gray-300'} rounded-t-md`}>
        {`main.${getFileExtension(language)}`}
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <Button 
          variant="ghost" 
          size="icon"
          className={`${theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#3e3e42]'} rounded-md`}
          onClick={handleUploadImage}
          disabled={isUploading}
          title="Extract Code from Image"
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={`${theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#3e3e42]'} rounded-md`}
          onClick={handleSaveCode}
          title="Save Code"
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={`${theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#3e3e42]'} rounded-md`}
          onClick={handleCopyCode}
          title="Copy Code"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={`${theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#3e3e42]'} rounded-md`}
          onClick={handleDownloadCode}
          title="Download Code"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={`${theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#3e3e42]'} rounded-md`}
          onClick={handleShareCode}
          disabled={isSharing}
          title="Share Code"
        >
          <Share2 className={`h-4 w-4 ${isSharing ? 'text-green-500' : ''}`} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={`${theme === 'light' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-300 hover:bg-[#3e3e42]'} rounded-md ${showDocumentation ? 'bg-blue-500/10' : ''}`}
          onClick={toggleDocumentation}
          title="Documentation"
        >
          <FileText className={`h-4 w-4 ${showDocumentation ? 'text-blue-500' : ''}`} />
        </Button>
        <Button
          onClick={handleRunCode}
          disabled={loading}
          className={`${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-1 rounded-md flex items-center`}
        >
          {loading ? 'Running...' : (
            <>
              <span className="h-4 w-4 mr-1">▶</span>
              Run
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
