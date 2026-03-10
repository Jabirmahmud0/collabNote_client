import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../hooks/useTheme';

const MarkdownPreview = () => {
  const { theme } = useTheme();
  const [markdown, setMarkdown] = useState('# Hello World\n\nStart typing your **markdown** here...');

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-primary">Markdown Preview</h2>
        <p className="text-sm text-text-secondary">
          Type markdown on the left, see the preview on the right
        </p>
      </div>

      <div className="flex-1 grid grid-cols-2 divide-x divide-border">
        {/* Editor */}
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-full p-4 bg-bg-primary text-primary font-mono text-sm resize-none focus:outline-none"
          placeholder="Enter markdown..."
        />

        {/* Preview */}
        <div className="w-full h-full p-4 overflow-auto bg-bg-primary">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={theme === 'dark' ? vscDarkPlus : undefined}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownPreview;
