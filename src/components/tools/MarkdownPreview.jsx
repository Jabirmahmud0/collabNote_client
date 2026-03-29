import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../hooks/useTheme';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const MarkdownPreview = () => {
  const { theme } = useTheme();
  const [markdown, setMarkdown] = useState('# Hello World\n\nStart typing your **markdown** here...');

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-primary">Markdown Preview</h2>
        <p className="text-sm text-text-secondary">
          Type markdown on the left, see the preview on the right
        </p>
      </div>

      <div className="flex-1 grid grid-cols-2 divide-x divide-border min-h-0">
        {/* Editor */}
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-full p-4 bg-bg-primary text-primary font-mono text-sm resize-none focus:outline-none"
          placeholder="Enter markdown..."
        />

        {/* Preview */}
        <div className="w-full h-full p-6 overflow-auto bg-bg-primary custom-scrollbar">
          {!markdown ? (
            <div className="h-full flex flex-col items-center justify-center text-text-muted space-y-4 opacity-50">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p className="text-sm font-medium">No content to preview</p>
              <p className="text-xs">Start typing markdown in the editor to see it rendered here...</p>
            </div>
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none 
              prose-headings:font-heading prose-headings:tracking-tight prose-headings:mb-4
              prose-h1:text-3xl prose-h1:font-extrabold
              prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8
              prose-h3:text-xl prose-h3:font-semibold
              prose-p:text-text-primary prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-accent/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:italic
              prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-bg-secondary prose-pre:border prose-pre:border-border prose-pre:p-0 prose-pre:rounded-xl
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:my-1
              prose-img:rounded-xl prose-img:shadow-lg
              prose-hr:border-border prose-hr:my-8
              prose-table:border prose-table:border-border prose-table:rounded-xl prose-table:overflow-hidden
              prose-thead:bg-bg-secondary prose-th:px-4 prose-th:py-3 prose-th:text-left
              prose-td:px-4 prose-td:py-3 prose-td:border-t prose-td:border-border
            ">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="relative group overflow-hidden rounded-xl border border-border bg-bg-secondary my-4">
                        <div className="flex items-center justify-between px-4 py-2 bg-white/3 border-b border-border">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">{match[1]}</span>
                        </div>
                        <SyntaxHighlighter
                          style={theme === 'dark' ? vscDarkPlus : undefined}
                          language={match[1]}
                          PreTag="div"
                          className="!bg-transparent !m-0 !p-4 custom-scrollbar"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-accent/10 text-accent px-1.5 py-0.5 rounded-md font-mono text-[0.9em]" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownPreview;
