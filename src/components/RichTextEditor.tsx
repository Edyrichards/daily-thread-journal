
import React, { useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Quote, List, BookOpen } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onAddVerse?: () => void;
  autoSave?: boolean;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "What's on your heart today?",
  onAddVerse,
  autoSave = true,
  className = ""
}) => {
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (autoSave && value) {
      // Clear previous timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Set new auto-save timer
      autoSaveTimerRef.current = setTimeout(() => {
        localStorage.setItem('journal_draft', value);
      }, 1000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [value, autoSave]);

  useEffect(() => {
    // Load draft on mount
    const draft = localStorage.getItem('journal_draft');
    if (draft && !value) {
      onChange(draft);
    }
  }, []);

  const insertText = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-2 pb-2 border-b border-border">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertText('**', '**')}
          className="h-8 px-2"
        >
          <Bold size={14} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertText('*', '*')}
          className="h-8 px-2"
        >
          <Italic size={14} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertText('> ')}
          className="h-8 px-2"
        >
          <Quote size={14} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertText('• ')}
          className="h-8 px-2"
        >
          <List size={14} />
        </Button>
        {onAddVerse && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onAddVerse}
            className="h-8 px-2 ml-auto"
          >
            <BookOpen size={14} className="mr-1" />
            Add Verse
          </Button>
        )}
      </div>
      
      <Textarea
        id="rich-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[300px] border-0 shadow-none focus:ring-0 resize-none text-lg font-serif leading-relaxed"
      />
      
      {autoSave && value && (
        <div className="text-xs text-muted-foreground">
          Auto-saving draft...
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
