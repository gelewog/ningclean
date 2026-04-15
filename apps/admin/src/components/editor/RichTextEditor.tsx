'use client'

import * as React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CharacterCount from '@tiptap/extension-character-count'
import Typography from '@tiptap/extension-typography'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, ListChecks, Quote, Code, Code2,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Link2Off as LinkOff, Undo, Redo,
  Table as TableIcon, Trash2, Plus, Columns,
  FileCode, Check, X, Type, ChevronDown, Minus,
  Image as ImageIcon, Highlighter, Palette,
  Superscript as SuperscriptIcon, Subscript as SubscriptIcon,
  MoreHorizontal, Maximize2, Minimize2, Copy, Eraser,
  PanelTop, RowsIcon, ColumnsIcon, Indent, Outdent,
  Search, Replace, Printer, Download, Upload, ChevronRight,
  AlignVerticalJustifyCenter, Move, GripVertical, SeparatorHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
  DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
  maxCharacters?: number
  minHeight?: number
  onImageUpload?: (file: File) => Promise<string>
  toolbar?: ToolbarSection[]
}

type ToolbarSection = 'history' | 'style' | 'format' | 'script' | 'align' | 'list' | 'indent' | 'insert' | 'table' | 'color' | 'source'

// ─── Color Palette ─────────────────────────────────────────────────────────────

const TEXT_COLORS = [
  { label: 'Default', value: '' },
  { label: 'Black', value: '#000000' },
  { label: 'Dark Gray', value: '#374151' },
  { label: 'Gray', value: '#6B7280' },
  { label: 'Light Gray', value: '#D1D5DB' },
  { label: 'White', value: '#FFFFFF' },
  { label: 'Red', value: '#EF4444' },
  { label: 'Orange', value: '#F97316' },
  { label: 'Amber', value: '#F59E0B' },
  { label: 'Yellow', value: '#EAB308' },
  { label: 'Lime', value: '#84CC16' },
  { label: 'Green', value: '#22C55E' },
  { label: 'Emerald', value: '#10B981' },
  { label: 'Teal', value: '#14B8A6' },
  { label: 'Cyan', value: '#06B6D4' },
  { label: 'Sky', value: '#0EA5E9' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Indigo', value: '#6366F1' },
  { label: 'Violet', value: '#8B5CF6' },
  { label: 'Purple', value: '#A855F7' },
  { label: 'Fuchsia', value: '#D946EF' },
  { label: 'Pink', value: '#EC4899' },
  { label: 'Rose', value: '#F43F5E' },
]

const HIGHLIGHT_COLORS = [
  { label: 'None', value: '' },
  { label: 'Yellow', value: '#FEF08A' },
  { label: 'Green', value: '#BBF7D0' },
  { label: 'Blue', value: '#BAE6FD' },
  { label: 'Pink', value: '#FBCFE8' },
  { label: 'Orange', value: '#FED7AA' },
  { label: 'Purple', value: '#E9D5FF' },
  { label: 'Red', value: '#FECACA' },
]

// ─── Heading Options ───────────────────────────────────────────────────────────

const HEADING_OPTIONS = [
  { label: 'Paragraph', value: 'paragraph', icon: Type, className: 'text-sm' },
  { label: 'Heading 1', value: 'h1', level: 1, icon: Heading1, className: 'text-2xl font-bold' },
  { label: 'Heading 2', value: 'h2', level: 2, icon: Heading2, className: 'text-xl font-bold' },
  { label: 'Heading 3', value: 'h3', level: 3, icon: Heading3, className: 'text-lg font-semibold' },
  { label: 'Heading 4', value: 'h4', level: 4, icon: Heading4, className: 'text-base font-semibold' },
  { label: 'Heading 5', value: 'h5', level: 5, icon: Heading5, className: 'text-sm font-semibold' },
  { label: 'Heading 6', value: 'h6', level: 6, icon: Heading6, className: 'text-xs font-semibold uppercase tracking-wide' },
]

// ─── Main Component ─────────────────────────────────────────────────────────────

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  className = '',
  editable = true,
  maxCharacters,
  minHeight = 400,
  onImageUpload,
  toolbar,
}: RichTextEditorProps) {
  const [isSourceMode, setIsSourceMode] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [sourceValue, setSourceValue] = React.useState(value)
  const [isFindReplaceOpen, setIsFindReplaceOpen] = React.useState(false)
  const [findText, setFindText] = React.useState('')
  const [replaceText, setReplaceText] = React.useState('')
  const [wordCount, setWordCount] = React.useState(0)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const editorWrapperRef = React.useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Placeholder.configure({ placeholder }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'rte-link' },
      }),
      Image.configure({ HTMLAttributes: { class: 'rte-image' } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Typography,
      Superscript,
      Subscript,
      ...(maxCharacters ? [CharacterCount.configure({ limit: maxCharacters })] : []),
    ],
    content: value,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
      const text = editor.getText()
      setWordCount(text.split(/\s+/).filter(Boolean).length)
    },
  })

  // Sync external value
  React.useEffect(() => {
    if (editor && !isSourceMode && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor, isSourceMode])

  React.useEffect(() => {
    if (isSourceMode && editor) setSourceValue(editor.getHTML())
  }, [isSourceMode, editor])

  // Fullscreen keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault()
        setIsFullscreen(f => !f)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault()
        setIsFindReplaceOpen(f => !f)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const addLink = () => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addImage = (src: string, alt = '') => {
    editor?.chain().focus().setImage({ src, alt }).run()
  }

  const addImageByUrl = () => {
    const url = window.prompt('Image URL:')
    if (url) addImage(url)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onImageUpload) return
    try {
      const url = await onImageUpload(file)
      addImage(url, file.name)
    } catch (err) {
      console.error('Image upload failed:', err)
    }
    e.target.value = ''
  }

  const insertTable = (rows = 3, cols = 3) => {
    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
  }

  const applySourceChanges = () => {
    onChange(sourceValue)
    editor?.commands.setContent(sourceValue)
    setIsSourceMode(false)
  }

  const handleFindReplace = () => {
    if (!editor || !findText) return
    const content = editor.getHTML()
    const newContent = content.replaceAll(findText, replaceText)
    editor.commands.setContent(newContent)
    onChange(newContent)
  }

  const handlePrint = () => {
    if (!editor) return
    const html = editor.getHTML()
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<html><head><title>Print</title></head><body>${html}</body></html>`)
    win.document.close()
    win.print()
  }

  const handleExportHTML = () => {
    if (!editor) return
    const blob = new Blob([editor.getHTML()], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'content.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearFormatting = () => {
    editor?.chain().focus().clearNodes().unsetAllMarks().run()
  }

  const copyHTML = () => {
    if (!editor) return
    navigator.clipboard.writeText(editor.getHTML())
  }

  const getCurrentStyle = () => {
    if (!editor) return 'Paragraph'
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i })) return `Heading ${i}`
    }
    if (editor.isActive('paragraph')) return 'Paragraph'
    return 'Style'
  }

  const charCount = editor?.storage?.characterCount?.characters?.() ?? 0
  const charPercent = maxCharacters ? Math.round((charCount / maxCharacters) * 100) : 0

  if (!editor) {
    return (
      <div className={`rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 animate-pulse ${className}`}
        style={{ minHeight }} />
    )
  }

  const wrapperClass = cn(
    'rte-wrapper rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex flex-col',
    isFullscreen && 'fixed inset-0 z-50 rounded-none',
    className,
  )

  return (
    <TooltipProvider delayDuration={400}>
      <div ref={editorWrapperRef} className={wrapperClass}>

        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
        <div className="rte-toolbar sticky top-0 z-20 border-b border-gray-200 dark:border-slate-700 bg-gray-50/98 dark:bg-slate-800/98 backdrop-blur">
          {/* Row 1 */}
          <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 dark:border-slate-700/50">

            {/* History */}
            <ToolbarGroup>
              <TipButton onClick={() => editor.chain().focus().undo().run()} tip="Undo (Ctrl+Z)"
                disabled={!editor.can().undo()} icon={Undo} />
              <TipButton onClick={() => editor.chain().focus().redo().run()} tip="Redo (Ctrl+Y)"
                disabled={!editor.can().redo()} icon={Redo} />
            </ToolbarGroup>

            <ToolbarDivider />

            {/* Style Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="sm"
                  className="h-8 px-2.5 text-xs font-medium gap-1 min-w-[110px] justify-between">
                  {getCurrentStyle()}
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52" align="start">
                <DropdownMenuLabel className="text-xs text-gray-500">Text Style</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {HEADING_OPTIONS.map(opt => (
                  <DropdownMenuItem key={opt.value}
                    onClick={() => opt.value === 'paragraph'
                      ? editor.chain().focus().setParagraph().run()
                      : editor.chain().focus().toggleHeading({ level: opt.level as 1|2|3|4|5|6 }).run()}
                    className={cn('cursor-pointer', editor.isActive(
                      opt.value === 'paragraph' ? 'paragraph' : 'heading',
                      opt.level ? { level: opt.level } : {}
                    ) && 'bg-gray-100 dark:bg-slate-700')}>
                    <opt.icon className="w-4 h-4 mr-2 shrink-0" />
                    <span className={opt.className}>{opt.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ToolbarDivider />

            {/* Format */}
            <ToolbarGroup>
              <TipButton onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')} tip="Bold (Ctrl+B)" icon={Bold} />
              <TipButton onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')} tip="Italic (Ctrl+I)" icon={Italic} />
              <TipButton onClick={() => editor.chain().focus().toggleUnderline().run()}
                active={editor.isActive('underline')} tip="Underline (Ctrl+U)" icon={UnderlineIcon} />
              <TipButton onClick={() => editor.chain().focus().toggleStrike().run()}
                active={editor.isActive('strike')} tip="Strikethrough" icon={Strikethrough} />
            </ToolbarGroup>

            <ToolbarDivider />

            {/* Script */}
            <ToolbarGroup>
              <TipButton onClick={() => editor.chain().focus().toggleSuperscript().run()}
                active={editor.isActive('superscript')} tip="Superscript" icon={SuperscriptIcon} />
              <TipButton onClick={() => editor.chain().focus().toggleSubscript().run()}
                active={editor.isActive('subscript')} tip="Subscript" icon={SubscriptIcon} />
            </ToolbarGroup>

            <ToolbarDivider />

            {/* Color */}
            <ColorPicker
              label="Text Color"
              icon={Palette}
              colors={TEXT_COLORS}
              onSelect={(color) => {
                if (!color) editor.chain().focus().unsetColor().run()
                else editor.chain().focus().setColor(color).run()
              }}
              currentColor={(editor.getAttributes('textStyle').color as string) || ''}
            />
            <ColorPicker
              label="Highlight"
              icon={Highlighter}
              colors={HIGHLIGHT_COLORS}
              onSelect={(color) => {
                if (!color) editor.chain().focus().unsetHighlight().run()
                else editor.chain().focus().setHighlight({ color }).run()
              }}
              currentColor={(editor.getAttributes('highlight').color as string) || ''}
              isHighlight
            />

            <ToolbarDivider />

            {/* Clear Formatting */}
            <TipButton onClick={clearFormatting} tip="Clear Formatting" icon={Eraser} />

            <div className="flex-1" />

            {/* Right Actions */}
            <ToolbarGroup>
              <TipButton onClick={handlePrint} tip="Print" icon={Printer} />
              <TipButton onClick={handleExportHTML} tip="Export HTML" icon={Download} />
              <TipButton onClick={copyHTML} tip="Copy HTML" icon={Copy} />
              <TipButton onClick={() => setIsFindReplaceOpen(f => !f)} tip="Find & Replace (Ctrl+H)"
                active={isFindReplaceOpen} icon={Search} />
            </ToolbarGroup>

            <ToolbarDivider />

            <TipButton onClick={() => setIsFullscreen(f => !f)}
              tip={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen (Ctrl+Shift+F)'}
              icon={isFullscreen ? Minimize2 : Maximize2} />
            <TipButton onClick={() => setIsSourceMode(true)} tip="HTML Source" icon={FileCode} />
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap items-center gap-0.5 px-2 py-1">

            {/* Align */}
            <ToolbarGroup>
              <TipButton onClick={() => editor.chain().focus().setTextAlign('left').run()}
                active={editor.isActive({ textAlign: 'left' })} tip="Align Left" icon={AlignLeft} />
              <TipButton onClick={() => editor.chain().focus().setTextAlign('center').run()}
                active={editor.isActive({ textAlign: 'center' })} tip="Align Center" icon={AlignCenter} />
              <TipButton onClick={() => editor.chain().focus().setTextAlign('right').run()}
                active={editor.isActive({ textAlign: 'right' })} tip="Align Right" icon={AlignRight} />
              <TipButton onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                active={editor.isActive({ textAlign: 'justify' })} tip="Justify" icon={AlignJustify} />
            </ToolbarGroup>

            <ToolbarDivider />

            {/* Lists */}
            <ToolbarGroup>
              <TipButton onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive('bulletList')} tip="Bullet List" icon={List} />
              <TipButton onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive('orderedList')} tip="Numbered List" icon={ListOrdered} />
              <TipButton onClick={() => editor.chain().focus().toggleTaskList().run()}
                active={editor.isActive('taskList')} tip="Task List" icon={ListChecks} />
            </ToolbarGroup>

            <ToolbarDivider />

            {/* Indent */}
            <ToolbarGroup>
              <TipButton onClick={() => editor.chain().focus().liftListItem('listItem').run()}
                tip="Outdent" icon={Outdent} disabled={!editor.can().liftListItem('listItem')} />
              <TipButton onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
                tip="Indent" icon={Indent} disabled={!editor.can().sinkListItem('listItem')} />
            </ToolbarGroup>

            <ToolbarDivider />

            {/* Block */}
            <ToolbarGroup>
              <TipButton onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive('blockquote')} tip="Blockquote" icon={Quote} />
              <TipButton onClick={() => editor.chain().focus().toggleCode().run()}
                active={editor.isActive('code')} tip="Inline Code" icon={Code} />
              <TipButton onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                active={editor.isActive('codeBlock')} tip="Code Block" icon={Code2} />
              <TipButton onClick={() => editor.chain().focus().setHorizontalRule().run()}
                tip="Horizontal Rule" icon={SeparatorHorizontal} />
            </ToolbarGroup>

            <ToolbarDivider />

            {/* Insert */}
            <ToolbarGroup>
              {/* Link */}
              <TipButton onClick={addLink} active={editor.isActive('link')} tip="Insert Link" icon={LinkIcon} />
              {editor.isActive('link') && (
                <TipButton onClick={() => editor.chain().focus().unsetLink().run()} tip="Remove Link" icon={LinkOff} />
              )}

              {/* Image */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    'rte-btn flex items-center justify-center h-8 w-8 rounded-md transition-colors',
                    'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
                  )} title="Insert Image">
                    <ImageIcon className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={addImageByUrl}>
                    <LinkIcon className="w-4 h-4 mr-2" /> From URL
                  </DropdownMenuItem>
                  {onImageUpload && (
                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-2" /> Upload File
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Table */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    'rte-btn flex items-center justify-center h-8 w-8 rounded-md transition-colors',
                    editor.isActive('table')
                      ? 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
                  )} title="Table">
                    <TableIcon className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {!editor.isActive('table') ? (
                    <>
                      <DropdownMenuLabel className="text-xs">Insert Table</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => insertTable(2, 2)}>2 × 2</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => insertTable(3, 3)}>3 × 3</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => insertTable(3, 4)}>3 × 4</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => insertTable(4, 4)}>4 × 4</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => insertTable(5, 5)}>5 × 5</DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuLabel className="text-xs">Table</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
                        <Plus className="w-4 h-4 mr-2" /> Add Column Before
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
                        <Plus className="w-4 h-4 mr-2" /> Add Column After
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Column
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
                        <Plus className="w-4 h-4 mr-2" /> Add Row Before
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
                        <Plus className="w-4 h-4 mr-2" /> Add Row After
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Row
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => editor.chain().focus().mergeCells().run()}>
                        Merge Cells
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => editor.chain().focus().splitCell().run()}>
                        Split Cell
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
                        Toggle Header Row
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => editor.chain().focus().deleteTable().run()}
                        className="text-red-600 dark:text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Table
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </ToolbarGroup>
          </div>

          {/* Find & Replace Bar */}
          {isFindReplaceOpen && (
            <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100 dark:border-slate-700/50 bg-amber-50/80 dark:bg-amber-900/10">
              <Search className="w-4 h-4 text-amber-600 shrink-0" />
              <Input
                value={findText}
                onChange={e => setFindText(e.target.value)}
                placeholder="Find..."
                className="h-7 text-xs w-40"
              />
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              <Input
                value={replaceText}
                onChange={e => setReplaceText(e.target.value)}
                placeholder="Replace with..."
                className="h-7 text-xs w-40"
              />
              <Button type="button" size="sm" variant="secondary" className="h-7 text-xs px-3"
                onClick={handleFindReplace}>Replace All</Button>
              <Button type="button" size="sm" variant="ghost" className="h-7 w-7 p-0 ml-auto"
                onClick={() => setIsFindReplaceOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* ── Source Mode ──────────────────────────────────────────────────── */}
        {isSourceMode ? (
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-gray-600 dark:text-slate-400 font-mono ml-2">HTML Source</span>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsSourceMode(false)}
                  className="h-7 px-2 text-xs text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white">
                  <X className="h-3 w-3 mr-1" /> Cancel
                </Button>
                <Button type="button" size="sm" onClick={applySourceChanges}
                  className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Check className="h-3 w-3 mr-1" /> Apply
                </Button>
              </div>
            </div>
            <Textarea
              value={sourceValue}
              onChange={e => setSourceValue(e.target.value)}
              className="flex-1 font-mono text-xs bg-white dark:bg-slate-950 text-gray-800 dark:text-green-400 border-0 rounded-none resize-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 leading-relaxed p-4"
              placeholder="<h1>Edit HTML source here...</h1>"
              spellCheck={false}
              style={{ minHeight }}
            />
          </div>
        ) : (
          /* ── Editor Area ─────────────────────────────────────────────────── */
          <div className="relative flex-1 overflow-auto">

            {/* Editor */}
            <EditorContent
              editor={editor}
              className="rte-content"
              style={{ minHeight }}
            />
          </div>
        )}

        {/* ── Status Bar ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-1.5 border-t border-gray-100 dark:border-slate-700/60 bg-gray-50/80 dark:bg-slate-800/50 text-xs text-gray-500 dark:text-gray-500">
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{charCount} characters{maxCharacters ? ` / ${maxCharacters}` : ''}</span>
            {maxCharacters && (
              <div className="w-24 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', charPercent > 90 ? 'bg-red-500' : 'bg-emerald-500')}
                  style={{ width: `${Math.min(charPercent, 100)}%` }}
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isFullscreen && (
              <span className="opacity-60">Press Esc to exit fullscreen</span>
            )}
            <span className="opacity-60">Tiptap</span>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

      {/* Global Styles */}
      <style>{RTE_STYLES}</style>
    </TooltipProvider>
  )
}

// ─── Sub-Components ────────────────────────────────────────────────────────────

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-gray-200 dark:bg-slate-700 mx-1 shrink-0" />
}

function TipButton({
  onClick, active = false, tip, icon: Icon, disabled = false, className,
}: {
  onClick: () => void
  active?: boolean
  tip: string
  icon: React.ElementType
  disabled?: boolean
  className?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'rte-btn flex items-center justify-center h-8 w-8 rounded-md transition-colors disabled:opacity-40 disabled:pointer-events-none',
            active
              ? 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white',
            className,
          )}>
          <Icon className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">{tip}</TooltipContent>
    </Tooltip>
  )
}

function BubbleBtn({
  onClick, active, icon: Icon,
}: { onClick: () => void; active: boolean; icon: React.ElementType }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center w-7 h-7 rounded transition-colors',
        active
          ? 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white',
      )}>
      <Icon className="h-3.5 w-3.5" />
    </button>
  )
}

function ColorPicker({
  label, icon: Icon, colors, onSelect, currentColor, isHighlight = false,
}: {
  label: string
  icon: React.ElementType
  colors: { label: string; value: string }[]
  onSelect: (color: string) => void
  currentColor: string
  isHighlight?: boolean
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={label}
          className="rte-btn flex flex-col items-center justify-center h-8 w-8 rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white gap-0.5">
          <Icon className="h-3.5 w-3.5" />
          <div className="w-4 h-0.5 rounded-full" style={{ background: currentColor || (isHighlight ? 'transparent' : 'currentColor'), border: !currentColor && isHighlight ? '1px solid currentColor' : undefined }} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</p>
        <div className="grid grid-cols-6 gap-1">
          {colors.map(c => (
            <button
              key={c.value || 'none'}
              type="button"
              title={c.label}
              onClick={() => onSelect(c.value)}
              className={cn(
                'w-6 h-6 rounded border-2 transition-all hover:scale-110',
                currentColor === c.value ? 'border-gray-900 dark:border-white' : 'border-transparent',
                !c.value && 'bg-gradient-to-br from-gray-200 to-gray-400 dark:from-slate-600 dark:to-slate-800',
              )}
              style={c.value ? { background: c.value } : undefined}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const RTE_STYLES = `
  .rte-content .ProseMirror {
    outline: none;
    padding: 1.5rem 2rem;
    min-height: inherit;
    line-height: 1.75;
    font-size: 0.9375rem;
    color: inherit;
  }

  .rte-content .ProseMirror > * + * { margin-top: 0.75em; }
  .rte-content .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #9CA3AF;
    pointer-events: none;
    height: 0;
  }

  /* Headings */
  .rte-content .ProseMirror h1 { font-size: 2em; font-weight: 800; line-height: 1.2; margin-top: 1.2em; }
  .rte-content .ProseMirror h2 { font-size: 1.5em; font-weight: 700; line-height: 1.3; margin-top: 1em; }
  .rte-content .ProseMirror h3 { font-size: 1.25em; font-weight: 600; line-height: 1.4; margin-top: 0.9em; }
  .rte-content .ProseMirror h4 { font-size: 1.1em; font-weight: 600; margin-top: 0.8em; }
  .rte-content .ProseMirror h5 { font-size: 1em; font-weight: 600; margin-top: 0.8em; }
  .rte-content .ProseMirror h6 { font-size: 0.875em; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.8em; color: #6B7280; }

  /* Lists */
  .rte-content .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; }
  .rte-content .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; }
  .rte-content .ProseMirror li { margin: 0.25em 0; }
  .rte-content .ProseMirror li > p { margin: 0; }
  .rte-content .ProseMirror ul[data-type="taskList"] { list-style: none; padding-left: 0; }
  .rte-content .ProseMirror ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.5em; }
  .rte-content .ProseMirror ul[data-type="taskList"] li > label { user-select: none; margin-top: 0.2em; }
  .rte-content .ProseMirror ul[data-type="taskList"] li > label input { cursor: pointer; accent-color: #10B981; }

  /* Blockquote */
  .rte-content .ProseMirror blockquote {
    border-left: 3px solid #10B981;
    margin: 1em 0;
    padding: 0.75em 1.25em;
    background: #F0FDF4;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: #374151;
  }
  .dark .rte-content .ProseMirror blockquote {
    background: rgba(16,185,129,0.08);
    color: #D1D5DB;
  }

  /* Code */
  .rte-content .ProseMirror code {
    background: #F3F4F6;
    color: #EF4444;
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.875em;
  }
  .dark .rte-content .ProseMirror code { background: #1F2937; color: #F87171; }
  .rte-content .ProseMirror pre {
    background: #1E293B;
    color: #E2E8F0;
    padding: 1em 1.5em;
    border-radius: 10px;
    overflow-x: auto;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.875em;
    line-height: 1.6;
  }
  .rte-content .ProseMirror pre code { background: transparent; color: inherit; padding: 0; }

  /* HR */
  .rte-content .ProseMirror hr {
    border: none;
    border-top: 2px solid #E5E7EB;
    margin: 2em 0;
  }
  .dark .rte-content .ProseMirror hr { border-color: #334155; }

  /* Links */
  .rte-content .ProseMirror a.rte-link {
    color: #3B82F6;
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
  }
  .rte-content .ProseMirror a.rte-link:hover { color: #1D4ED8; }

  /* Images */
  .rte-content .ProseMirror img.rte-image {
    max-width: 100%;
    border-radius: 8px;
    display: block;
    margin: 1em auto;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }
  .rte-content .ProseMirror img.rte-image.ProseMirror-selectednode {
    outline: 2px solid #10B981;
    outline-offset: 2px;
  }

  /* Tables */
  .rte-content .ProseMirror table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #E5E7EB;
  }
  .dark .rte-content .ProseMirror table { border-color: #334155; }
  .rte-content .ProseMirror th {
    background: #F9FAFB;
    font-weight: 600;
    padding: 0.6em 1em;
    border: 1px solid #E5E7EB;
    text-align: left;
    font-size: 0.875em;
  }
  .dark .rte-content .ProseMirror th { background: #1E293B; border-color: #334155; }
  .rte-content .ProseMirror td {
    padding: 0.6em 1em;
    border: 1px solid #E5E7EB;
    vertical-align: top;
  }
  .dark .rte-content .ProseMirror td { border-color: #334155; }
  .rte-content .ProseMirror .selectedCell::after {
    background: rgba(59,130,246,0.15);
    content: '';
    left: 0; right: 0; top: 0; bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
  }
  .rte-content .ProseMirror .column-resize-handle {
    background-color: #3B82F6;
    bottom: -2px;
    position: absolute;
    right: -2px;
    pointer-events: none;
    top: 0;
    width: 3px;
  }
  .rte-content .ProseMirror.resize-cursor { cursor: col-resize; }

  /* Highlight */
  .rte-content .ProseMirror mark {
    border-radius: 3px;
    padding: 0.1em 0.2em;
  }

  /* Selection */
  .rte-content .ProseMirror ::selection { background: rgba(16,185,129,0.2); }

  /* Fullscreen body lock */
  body:has(.rte-wrapper.fixed) { overflow: hidden; }
`