import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";

const Conversation = ({ messages, isGenerating }) => {
  return (
    <>
      {messages.map((msg, index) => (
        <div
          key={msg.id || index}
          className={`flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          } mb-6 animate-fade-in`}
        >
          <div
            className={`relative max-w-2xl px-5 py-4 rounded-2xl shadow-sm transition-all duration-200 ease-in-out ${
              msg.role === "user"
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-800 border border-zinc-200"
            }`}
          >
            <ReactMarkdown
              className={`prose prose-sm max-w-none ${
                msg.role === "user"
                  ? "prose-invert text-white"
                  : "prose-zinc text-zinc-800"
              }`}
              components={{
                // Headings
                h1: ({ node, ...props }) => (
                  <h1
                    className={`text-xl font-semibold mt-3 mb-2 ${
                      msg.role === "user" ? "text-white" : "text-zinc-900"
                    }`}
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className={`text-lg font-semibold mt-3 mb-2 ${
                      msg.role === "user" ? "text-white" : "text-zinc-900"
                    }`}
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className={`text-base font-semibold mt-2 mb-1 ${
                      msg.role === "user" ? "text-white" : "text-zinc-900"
                    }`}
                    {...props}
                  />
                ),

                // Lists
                ul: ({ node, ...props }) => (
                  <ul
                    className={`list-disc list-inside my-2 space-y-1 ${
                      msg.role === "user" ? "text-white" : "text-zinc-800"
                    }`}
                    {...props}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    className={`list-decimal list-inside my-2 space-y-1 ${
                      msg.role === "user" ? "text-white" : "text-zinc-800"
                    }`}
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => <li className="ml-2" {...props} />,

                // Code blocks
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const content = String(children).replace(/\n$/, "");

                  // Inline code
                  if (inline) {
                    return (
                      <code
                        className={`px-1.5 py-0.5 rounded-md font-mono text-sm ${
                          msg.role === "user"
                            ? "bg-zinc-800 text-white"
                            : "bg-zinc-100 text-zinc-900"
                        }`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  // Code block with language
                  return (
                    <div className="my-3 rounded-xl overflow-hidden shadow-sm">
                      <div className="flex justify-between items-center bg-zinc-800 px-4 py-2.5">
                        <span className="font-mono text-xs text-zinc-300 font-medium">
                          {match ? match[1] : "code"}
                        </span>
                        <button
                          className="text-xs text-zinc-300 hover:text-white transition-all duration-200 px-3 py-1 rounded-md hover:bg-zinc-700"
                          onClick={() => navigator.clipboard.writeText(content)}
                          title="Copy to clipboard"
                        >
                          Copy
                        </button>
                      </div>
                      <SyntaxHighlighter
                        language={match ? match[1] : "text"}
                        style={vscDarkPlus}
                        PreTag="div"
                        className="!m-0 !p-4 !bg-zinc-900 !text-sm"
                        wrapLongLines={true}
                      >
                        {content}
                      </SyntaxHighlighter>
                    </div>
                  );
                },

                // Links
                a: ({ node, ...props }) => (
                  <a
                    className={`underline hover:no-underline transition-colors duration-200 ${
                      msg.role === "user"
                        ? "text-zinc-200 hover:text-white"
                        : "text-zinc-700 hover:text-zinc-900"
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),

                // Blockquotes
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className={`border-l-3 pl-4 italic my-3 ${
                      msg.role === "user"
                        ? "border-zinc-600 text-zinc-200"
                        : "border-zinc-300 text-zinc-600"
                    }`}
                    {...props}
                  />
                ),

                // Paragraphs
                p: ({ node, ...props }) => (
                  <p className="mb-2 last:mb-0 leading-relaxed" {...props} />
                ),

                // Line breaks
                hr: ({ node, ...props }) => (
                  <hr
                    className={`my-4 ${
                      msg.role === "user"
                        ? "border-zinc-700"
                        : "border-zinc-200"
                    }`}
                    {...props}
                  />
                ),

                // Tables
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-3 rounded-lg">
                    <table
                      className={`border-collapse border ${
                        msg.role === "user"
                          ? "border-zinc-700"
                          : "border-zinc-200"
                      }`}
                      {...props}
                    />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th
                    className={`border px-3 py-2 font-semibold text-left ${
                      msg.role === "user"
                        ? "border-zinc-700 bg-zinc-800/30"
                        : "border-zinc-200 bg-zinc-50"
                    }`}
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td
                    className={`border px-3 py-2 ${
                      msg.role === "user"
                        ? "border-zinc-700"
                        : "border-zinc-200"
                    }`}
                    {...props}
                  />
                ),

                // Strong and emphasis
                strong: ({ node, ...props }) => (
                  <strong className="font-bold" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="italic" {...props} />
                ),
              }}
              remarkPlugins={[remarkGfm]}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}

      {/* Modern Loading indicator */}
      {isGenerating && (
        <div className="flex justify-start mb-6 animate-fade-in">
          <div className="max-w-2xl px-5 py-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
              <span className="text-sm text-zinc-500 font-medium">
                AI is thinking...
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Conversation;
