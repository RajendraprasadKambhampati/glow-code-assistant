
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { ImageIcon, UploadIcon, CheckIcon, XIcon } from "lucide-react";
import { extractCodeFromImage, ExtractedCodeResult } from '@/services/codeExtractionService';

interface ImageCodeExtractorProps {
  onCodeExtracted: (code: string, language: string) => void;
}

const ImageCodeExtractor: React.FC<ImageCodeExtractorProps> = ({ onCodeExtracted }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedCode, setExtractedCode] = useState<ExtractedCodeResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImage(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImage(e.target.files[0]);
    }
  };
  
  const processImage = async (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    
    // Preview the image
    setPreviewUrl(URL.createObjectURL(file));
    setIsProcessing(true);
    
    try {
      // Extract code from image
      const result = await extractCodeFromImage(file);
      setExtractedCode(result);
      
      toast({
        title: "Code extracted",
        description: `Detected language: ${result.language}`,
      });
    } catch (error) {
      console.error("Error extracting code:", error);
      toast({
        title: "Error",
        description: "Failed to extract code from image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const applyExtractedCode = () => {
    if (extractedCode) {
      onCodeExtracted(extractedCode.code, extractedCode.language);
      
      // Reset the component
      setPreviewUrl(null);
      setExtractedCode(null);
      
      toast({
        title: "Code applied",
        description: "The extracted code has been applied to the editor.",
      });
    }
  };
  
  const reset = () => {
    setPreviewUrl(null);
    setExtractedCode(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Extract Code from Image</h3>
      
      {!previewUrl ? (
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary/10' : 'border-muted'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            className="hidden"
          />
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag & drop an image or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports images with code snippets. We'll extract the code automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative h-40 rounded-md overflow-hidden border border-muted">
            <img
              src={previewUrl}
              alt="Code preview"
              className="w-full h-full object-cover"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
          
          {extractedCode && (
            <>
              <div className="rounded-md bg-black/50 p-3 max-h-40 overflow-auto">
                <pre className="text-xs text-foreground font-mono">
                  {extractedCode.code}
                </pre>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Detected: <span className="text-primary">{extractedCode.language}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Confidence: <span className="text-primary">{(extractedCode.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={applyExtractedCode}
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Apply Code
                </Button>
                <Button
                  variant="outline"
                  onClick={reset}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default ImageCodeExtractor;
