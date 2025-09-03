'use client';

import { useState, useRef } from 'react';
import ImageUpload from './ImageUpload';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    updateContent();
  };

  const handleImageUpload = (url: string) => {
    execCommand('insertImage', url);
    setShowImageUpload(false);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* ツールバー */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-2">
        {/* フォントサイズ */}
        <select
          onChange={(e) => execCommand('fontSize', e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="">サイズ</option>
          <option value="1">8px</option>
          <option value="2">10px</option>
          <option value="3">12px</option>
          <option value="4">14px</option>
          <option value="5">18px</option>
          <option value="6">24px</option>
          <option value="7">36px</option>
        </select>

        {/* フォントファミリー */}
        <select
          onChange={(e) => execCommand('fontName', e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="">フォント</option>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
          <option value="Courier New">Courier New</option>
          <option value="Impact">Impact</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
        </select>

        {/* 文字色 */}
        <input
          type="color"
          onChange={(e) => execCommand('foreColor', e.target.value)}
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          title="文字色"
        />

        {/* 背景色 */}
        <input
          type="color"
          onChange={(e) => execCommand('backColor', e.target.value)}
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          title="背景色"
        />

        {/* 区切り線 */}
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* 太字 */}
        <button
          onClick={() => execCommand('bold')}
          className="px-2 py-1 border border-gray-300 rounded text-sm font-bold hover:bg-gray-200"
          title="太字"
        >
          B
        </button>

        {/* 斜体 */}
        <button
          onClick={() => execCommand('italic')}
          className="px-2 py-1 border border-gray-300 rounded text-sm italic hover:bg-gray-200"
          title="斜体"
        >
          I
        </button>

        {/* 下線 */}
        <button
          onClick={() => execCommand('underline')}
          className="px-2 py-1 border border-gray-300 rounded text-sm underline hover:bg-gray-200"
          title="下線"
        >
          U
        </button>

        {/* 取り消し線 */}
        <button
          onClick={() => execCommand('strikeThrough')}
          className="px-2 py-1 border border-gray-300 rounded text-sm line-through hover:bg-gray-200"
          title="取り消し線"
        >
          S
        </button>

        {/* 区切り線 */}
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* 左寄せ */}
        <button
          onClick={() => execCommand('justifyLeft')}
          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-200"
          title="左寄せ"
        >
          ⬅
        </button>

        {/* 中央寄せ */}
        <button
          onClick={() => execCommand('justifyCenter')}
          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-200"
          title="中央寄せ"
        >
          ⬆
        </button>

        {/* 右寄せ */}
        <button
          onClick={() => execCommand('justifyRight')}
          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-200"
          title="右寄せ"
        >
          ➡
        </button>

        {/* 区切り線 */}
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* 番号付きリスト */}
        <button
          onClick={() => execCommand('insertOrderedList')}
          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-200"
          title="番号付きリスト"
        >
          1.
        </button>

        {/* 箇条書きリスト */}
        <button
          onClick={() => execCommand('insertUnorderedList')}
          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-200"
          title="箇条書きリスト"
        >
          •
        </button>

        {/* 区切り線 */}
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* リンク挿入 */}
        <button
          onClick={() => {
            const url = prompt('URLを入力してください:');
            if (url) execCommand('createLink', url);
          }}
          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-200"
          title="リンク挿入"
        >
          🔗
        </button>

        {/* 画像挿入 */}
        <button
          onClick={() => setShowImageUpload(!showImageUpload)}
          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-200"
          title="画像挿入"
        >
          🖼
        </button>

        {/* 区切り線 */}
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* 元に戻す */}
        <button
          onClick={() => execCommand('undo')}
          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-200"
          title="元に戻す"
        >
          ↶
        </button>

        {/* やり直し */}
        <button
          onClick={() => execCommand('redo')}
          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-200"
          title="やり直し"
        >
          ↷
        </button>
      </div>

      {/* 画像アップロードエリア */}
      {showImageUpload && (
        <div className="bg-blue-50 border-b border-gray-300 p-3">
          <ImageUpload
            onUpload={handleImageUpload}
            buttonText="画像をアップロードして挿入"
            showPreview={false}
          />
        </div>
      )}

      {/* エディタエリア */}
      <div
        ref={editorRef}
        contentEditable
        onInput={updateContent}
        onPaste={handlePaste}
        className="min-h-[300px] p-4 focus:outline-none"
        style={{ minHeight: '300px' }}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
