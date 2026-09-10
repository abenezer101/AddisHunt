'use client';

// Disable static generation to prevent SSR window errors
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Download, FileText, Pencil, Share, Copy, Check, ChevronDown,
  Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading1, Heading2,
  AlignLeft, AlignCenter, AlignRight, Underline, Save, Loader2, Undo, Redo, Palette, Terminal,
  Code
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showToast } from '@/utils/toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { apiRaw } from '@/lib/apiClient';
import { createShareLink } from '@/utils/noteSharing';
import { marked } from 'marked';
import { renderMathToHtml } from '@/lib/renderMath';
import { useSidebarStore } from '@/stores/sidebarStore';
import { AISidebar } from './AISidebar';

// TipTap imports
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import UnderlineExtension from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import Mathematics from '@tiptap/extension-mathematics';
import 'katex/dist/katex.min.css';

/**
 * Normalizes over-escaped LaTeX backslashes from DB content.

 * Reduces \\\\cmd (4 slashes) or \\cmd (2 slashes) → \cmd (1 slash)
 */
function fixLatexEscaping(text: string): string {
  return text
    .replace(/\\{4}([a-zA-Z{])/g, '\\$1')  // 4 → 1
    .replace(/\\{3}([a-zA-Z{])/g, '\\$1')  // 3 → 1
    .replace(/\\{2}([a-zA-Z{])/g, '\\$1'); // 2 → 1
}

/**
 * Detect whether content is already HTML (starts with an HTML tag).
 * AI-generated notes (image/youtube/audio/document) are stored as HTML.
 */
function isHtmlContent(content: string): boolean {
  return /^\s*<[a-zA-Z]/.test(content.trim());
}

const AskAIIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    className={className}
  >
    <g fill="none" fillRule="evenodd">
      <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
      <path fill="currentColor" d="M14.767 3a2.996 2.996 0 0 0 1.263 4.839l.378.129a1 1 0 0 1 .624.624l.13.378A2.995 2.995 0 0 0 22 10.233L21.999 16a3 3 0 0 1-3 3H7.333L4 21.5c-.824.618-2 .03-2-1V6a3 3 0 0 1 3-3zM11 12H8a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2m2-4H8a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2m7-7a1 1 0 0 1 .946.677l.13.378c.3.879.99 1.57 1.87 1.87l.377.129a1 1 0 0 1 0 1.892l-.378.13c-.879.3-1.57.99-1.87 1.87l-.129.377a1 1 0 0 1-1.892 0l-.13-.378a3 3 0 0 0-1.87-1.87l-.377-.129a1 1 0 0 1 0-1.892l.378-.13c.879-.3 1.57-.99 1.87-1.87l.129-.377A1 1 0 0 1 20 1" />
    </g>
  </svg>
);

export const NoteSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden relative">
      {/* FIXED HEADER SKELETON */}
      <div className="flex-shrink-0 z-30 bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5">
        <div className="p-2 sm:p-3 flex items-center justify-between">
          <Skeleton className="h-9 w-20 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20 rounded-xl" />
            <Skeleton className="h-8 w-20 rounded-xl" />
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-20 custom-scrollbar relative">
        <div className="mx-auto max-w-4xl pt-4 pb-12 relative">
          {/* STICKY FLOATING TOOLBAR SKELETON */}
          <div className="sticky top-4 z-50 mb-8 flex justify-center w-full">
            <Skeleton className="h-10 w-96 max-w-[95%] rounded-xl shadow-lg" />
          </div>

          {/* NOTE TITLE SKELETON */}
          <div className="mb-6">
            <Skeleton className="h-8 sm:h-10 w-2/3 rounded-lg mb-4" />
            <Skeleton className="h-4 w-36 rounded" />
          </div>

          {/* DOCUMENT BODY SKELETON LINES */}
          <div className="space-y-4 pt-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-[96%] rounded" />
            <Skeleton className="h-4 w-[92%] rounded" />
            <Skeleton className="h-4 w-[98%] rounded" />
            <Skeleton className="h-4 w-[85%] rounded" />

            <div className="py-2" />

            <Skeleton className="h-6 w-1/3 rounded mb-2" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-[94%] rounded" />
            <Skeleton className="h-4 w-[88%] rounded" />
            <Skeleton className="h-4 w-[97%] rounded" />
            <Skeleton className="h-4 w-[75%] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NotePage() {
  const params = useParams();
  const id = params?.noteId as string;
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastSavedContent, setLastSavedContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  
  // AI Sidebar state
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [initialAIQuery, setInitialAIQuery] = useState('');
  const { user, session } = useAuthStore();
  const { setSidebarCollapsed } = useSidebarStore();

  useEffect(() => {
    if (isAISidebarOpen) {
      setSidebarCollapsed(true);
    }
  }, [isAISidebarOpen, setSidebarCollapsed]);




  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      BubbleMenuExtension,
      Mathematics,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing your brilliant notes here...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-0 text-slate-900 dark:text-slate-100',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      if (html !== lastSavedContent) {
        setSaveStatus('idle');
      }
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (id) {
      fetchNote(id);
    }
  }, [id]);

  useEffect(() => {
    if (editor && note && content) {
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content);
        setLastSavedContent(content);
      }
    }
  }, [editor, note]);



  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content !== lastSavedContent && content !== '' && saveStatus !== 'saving') {
        handleSaveContent();
      }
    }, 60000);

    return () => clearInterval(autoSaveInterval);
  }, [content, lastSavedContent, saveStatus]);

  const fetchNote = async (noteId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .single();

      if (error) throw error;
      
      setNote(data);

      const rawContent = data.content || '';
      const fixed = fixLatexEscaping(rawContent);
      
      let finalContent = fixed;
      if (data.note_type !== 'text' && !isHtmlContent(fixed)) {
        // AI Markdown notes: parse to HTML for TipTap
        finalContent = marked.parse(fixed) as string;
      }
      
      setContent(finalContent);
      setLastSavedContent(finalContent);
      
      setSaveStatus('saved');

      if (data.text) {
        setTranscript(data.text);
      }
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error fetching note:', error);
      showToast.error("Error: Failed to load note");
      router.push('/view-notes');
    }
  };

  const handleSaveContent = useCallback(async () => {
    if (!note || saveStatus === 'saving') return;
    setSaveStatus('saving');
    try {
      const { error } = await supabase
        .from('notes')
        .update({ 
          content: content,
          updated_at: new Date().toISOString()
        })
        .eq('id', note.id);
      if (error) throw error;
      setLastSavedContent(content);
      setSaveStatus('saved');
    } catch (error: any) {
      console.error('Error saving note:', error);
      showToast.error("Error: Failed to save");
      setSaveStatus('idle');
    }
  }, [note, content, saveStatus]);

  const handleExportPDF = async () => {
    if (!note) return;
    try {
      setIsPdfGenerating(true);

      // Math is expanded here, not on the server: the PDF renderer has no
      // JavaScript engine, and this page already has KaTeX loaded.
      //
      // apiRaw rather than a hand-built request: it attaches the bearer,
      // refreshes a token about to expire, and signs the user out on a 401.
      // Reading the session and formatting the header by hand here meant an
      // expired session surfaced as a generic failure instead.
      const response = await apiRaw('/files/export/pdf', {
        body: {
          note_id: note.id,
          body_html: renderMathToHtml(content),
        },
        signal: AbortSignal.timeout(60000),
      });

      const pdfBlob = await response.blob();
      if (pdfBlob.size > 0) {
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${note.title || 'note'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        showToast.success("Success: PDF generated");
      }
    } catch (error: any) {
      console.error('Error exporting PDF:', error);
      showToast.error(`Error: Failed to export PDF`);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleDownloadTranscript = () => {
    if (!transcript) return;
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title || 'transcript'}-transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  const handleUpdateTitle = async () => {
    if (!note) return;
    try {
      const { error } = await supabase
        .from('notes')
        .update({ title: newTitle })
        .eq('id', note.id);
      if (error) throw error;
      setNote({ ...note, title: newTitle });
      setIsEditingTitle(false);
      showToast.success("Success: Title updated");
    } catch (error) {
      console.error('Error updating title:', error);
      showToast.error("Error: Failed to update title");
    }
  };

  const handleShareNote = async () => {
    if (!note) return;
    try {
      setIsSharing(true);
      const shareInfo = await createShareLink({ noteId: note.id });
      setShareUrl(shareInfo.shareUrl);
      setShowShareDialog(true);
    } catch (error: any) {
      console.error('Error sharing note:', error);
      showToast.error(`Error: Failed to share note`);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast.success("Success: Share link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast.error("Error: Failed to copy link");
    }
  };

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setIsLinkDialogOpen(true);
  };

  const handleLinkSubmit = () => {
    if (!editor) return;
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setIsLinkDialogOpen(false);
    setLinkUrl('');
  };

  if (isLoading) {
    return <NoteSkeleton />;
  }

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="text-xl font-semibold text-gray-500">Note not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full overflow-hidden relative">
      {/* FIXED HEADER */}
      <div className="flex-shrink-0 z-30 bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl">
        {/* Navigation Row */}
        <div className="p-2 sm:p-3 flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-gray-200 dark:border-white/10 backdrop-blur-md transition-all duration-300 px-4 py-2 h-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
                <Button
                  onClick={() => setIsAISidebarOpen(!isAISidebarOpen)}
                  variant="ghost"
                  className={cn(
                    "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md px-3 py-1.5 h-auto text-xs sm:text-sm rounded-xl transition-all duration-300",
                    isAISidebarOpen ? "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20" : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white"
                  )}
                >
                  <AskAIIcon className="h-4 w-4 mr-1.5" />
                  Ask AI
                </Button>

                <Button onClick={handleShareNote} disabled={isSharing} variant="ghost" className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md text-slate-700 dark:text-slate-300 px-3 py-1.5 h-auto text-xs sm:text-sm rounded-xl hover:text-indigo-600 dark:hover:text-white transition-all">
                  <Share className="h-3.5 w-3.5 mr-1.5" /> {isSharing ? 'Sharing...' : 'Share'}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button disabled={isPdfGenerating} variant="ghost" className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md text-slate-700 dark:text-slate-300 px-3 py-1.5 h-auto text-xs sm:text-sm rounded-xl hover:text-indigo-600 dark:hover:text-white transition-all">
                      <Download className="h-3.5 w-3.5 mr-1.5" /> Export <ChevronDown className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-slate-900 dark:text-white">
                    <DropdownMenuItem onClick={handleExportPDF} className="hover:bg-gray-100 dark:hover:bg-slate-800"><FileText className="h-4 w-4 mr-2" /> PDF</DropdownMenuItem>
                    {transcript && <DropdownMenuItem onClick={handleDownloadTranscript} className="hover:bg-gray-100 dark:hover:bg-slate-800"><FileText className="h-4 w-4 mr-2" /> Transcript</DropdownMenuItem>}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
        </div>
      </div>

        {/* Editor & Sidebar Split View */}
        <div className="flex-1 flex flex-row w-full min-h-0 overflow-hidden relative">
          
          {/* Main Editor Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-20 custom-scrollbar relative">
            <div className="mx-auto max-w-4xl pt-4 pb-12 relative">
            
            {/* STICKY FLOATING TOOLBAR */}
            <div className="sticky top-4 z-50 mb-8 flex justify-center w-full pointer-events-none">
              <div className="bg-white/80 dark:bg-slate-900/60 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-xl shadow-2xl p-1 flex flex-row items-center justify-center gap-0.5 sm:gap-1 pointer-events-auto w-fit max-w-[95%] overflow-x-auto scrollbar-hide">
                <Button
                  variant="ghost"
                  onClick={handleSaveContent}
                  disabled={saveStatus === 'saving' || (saveStatus === 'saved' && content === lastSavedContent)}
                  className={cn(
                    "flex items-center space-x-2 px-3 h-8 rounded-lg transition-all duration-500",
                    saveStatus === 'saved' && content === lastSavedContent
                      ? "bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/20 dark:border-green-500/30"
                      : "text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10"
                  )}
                  title="Save changes"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-medium">Saving...</span>
                    </>
                  ) : saveStatus === 'saved' && content === lastSavedContent ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400 animate-in zoom-in duration-300" />
                      <span className="text-xs font-medium">Saved</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-medium">Save</span>
                    </>
                  )}
                </Button>

                <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-0.5"></div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`h-8 w-8 rounded-lg transition-all ${editor?.isActive('bold') ? 'bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                  <Bold className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`h-8 w-8 rounded-lg transition-all ${editor?.isActive('italic') ? 'bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                  <Italic className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={`h-8 w-8 rounded-lg transition-all ${editor?.isActive('underline') ? 'bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                  <Underline className="h-3.5 w-3.5" />
                </Button>
                
                <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-0.5"></div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`h-8 w-8 rounded-lg transition-all ${editor?.isActive('heading', { level: 1 }) ? 'bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                  <Heading1 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`h-8 w-8 rounded-lg transition-all ${editor?.isActive('heading', { level: 2 }) ? 'bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                  <Heading2 className="h-3.5 w-3.5" />
                </Button>
                
                <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-0.5"></div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`h-8 w-8 rounded-lg transition-all ${editor?.isActive('bulletList') ? 'bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`h-8 w-8 rounded-lg transition-all ${editor?.isActive('orderedList') ? 'bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                </Button>

                <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-0.5"></div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                  className={`h-8 w-8 rounded-lg transition-all ${editor?.isActive({ textAlign: 'left' }) ? 'bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                  <AlignLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                  className={`h-8 w-8 rounded-lg transition-all ${editor?.isActive({ textAlign: 'center' }) ? 'bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                  <AlignCenter className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                  className={`h-8 w-8 rounded-lg transition-all ${editor?.isActive({ textAlign: 'right' }) ? 'bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                  <AlignRight className="h-3.5 w-3.5" />
                </Button>

                <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-0.5"></div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={setLink}
                  className={`h-8 w-8 rounded-lg transition-all ${editor?.isActive('link') ? 'bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                </Button>

                <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-0.5"></div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => editor?.chain().focus().toggleCode().run()}
                  className={`h-8 w-8 rounded-lg transition-all ${editor?.isActive('code') ? 'bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                  title="Inline Code"
                >
                  <Code className="h-3.5 w-3.5" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                  className={`h-8 w-8 rounded-lg transition-all ${editor?.isActive('codeBlock') ? 'bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                  title="Code Block"
                >
                  <Terminal className="h-3.5 w-3.5" />
                </Button>

                <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-0.5"></div>

                <div className="relative flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                  <Palette className="h-4 w-4 text-slate-600 dark:text-slate-400 pointer-events-none absolute" />
                  <input
                    type="color"
                    onInput={event => editor?.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                    value={editor?.getAttributes('textStyle').color || ''}
                    className="w-full h-full opacity-0 cursor-pointer"
                    title="Text Color"
                  />
                </div>
                
                <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-0.5"></div>

                <div className="hidden sm:flex items-center gap-0.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().undo().run()}
                    disabled={!editor?.can().undo()}
                    className="h-8 w-8 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30"
                  >
                    <Undo className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().redo().run()}
                    disabled={!editor?.can().redo()}
                    className="h-8 w-8 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30"
                  >
                    <Redo className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mb-8 group">
              {isEditingTitle ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
                    className="bg-transparent border-none p-0 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white focus:ring-0 w-full"
                    autoFocus
                  />
                  <Button onClick={handleUpdateTitle} size="sm" className="bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white">Save</Button>
                  <Button onClick={() => setIsEditingTitle(false)} variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Cancel</Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <h1 
                    className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight break-words cursor-text"
                    onClick={() => {
                      setNewTitle(note.title);
                      setIsEditingTitle(true);
                    }}
                  >
                    {note.title}
                  </h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setNewTitle(note.title);
                      setIsEditingTitle(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 dark:bg-white/5 h-7 w-7 rounded-lg"
                  >
                    <Pencil className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-2 min-h-[500px] relative">
              {editor && (
                <>
                  {/* ---- Text notes: full TipTap editor with bubble menu ---- */}
                  <BubbleMenu editor={editor}>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="flex items-center bg-white dark:bg-slate-900/95 border border-gray-200 dark:border-white/10 backdrop-blur-xl rounded-xl shadow-2xl p-1 gap-1"
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn(
                          "h-8 w-8 rounded-lg transition-all",
                          editor.isActive('bold') ? "bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10"
                        )}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn(
                          "h-8 w-8 rounded-lg transition-all",
                          editor.isActive('italic') ? "bg-indigo-500/10 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10"
                        )}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1" />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const { from, to } = editor.state.selection;
                          const selectedText = editor.state.doc.textBetween(from, to, ' ');
                          if (selectedText.trim()) {
                            setInitialAIQuery(`Analyze this part from my notes: "${selectedText}"`);
                            setIsAISidebarOpen(true);
                          }
                        }}
                        className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all font-medium whitespace-nowrap"
                      >
                        <AskAIIcon className="h-3.5 w-3.5" />
                        Ask AI
                      </Button>
                    </motion.div>
                  </BubbleMenu>
                  <EditorContent editor={editor} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* AI Chat Sidebar */}
        <div className="h-full pb-[5px] flex flex-col">
          <AISidebar 
            isOpen={isAISidebarOpen} 
            onClose={() => setIsAISidebarOpen(false)}
            noteId={id}
            noteContent={content}
            noteTitle={note?.title || ""}
            initialQuery={initialAIQuery}
          />
        </div>
      </div> {/* closes flex-1 flex-row split-view */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl">
          <DialogHeader><DialogTitle>Add Link</DialogTitle></DialogHeader>
          <div className="py-4">
            <Label htmlFor="url" className="text-slate-500 dark:text-slate-400">URL</Label>
            <Input id="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="mt-2 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-slate-900 dark:text-white" autoFocus />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsLinkDialogOpen(false)} className="text-slate-600 dark:text-slate-400">Cancel</Button>
            <Button onClick={handleLinkSubmit} className="bg-indigo-600 text-white">Save Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl">
          <DialogHeader><DialogTitle>Share Note</DialogTitle></DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Input value={shareUrl} readOnly className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-slate-900 dark:text-white" />
            <Button size="icon" className="bg-indigo-600 text-white" onClick={handleCopyShareUrl}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .ProseMirror { 
          color: inherit !important; 
          font-size: 1.1rem; 
          line-height: 1.6; 
        }
        .ProseMirror p.is-editor-empty:first-child::before { 
          content: 'Start writing...'; 
          float: left; 
          color: gray; 
          opacity: 0.4;
          pointer-events: none; 
          height: 0; 
        }
        .dark .ProseMirror p.is-editor-empty:first-child::before {
          color: rgba(255, 255, 255, 0.2);
        }
        .ProseMirror:focus { outline: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
}