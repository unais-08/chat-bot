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
          } mb-4`}
        >
          <div
            className={`relative max-w-2xl px-4 py-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
            }`}
          >
            <ReactMarkdown
              className={`prose prose-sm max-w-none ${
                msg.role === "user"
                  ? "prose-invert text-white"
                  : "prose-gray text-gray-800"
              }`}
              components={{
                // Headings
                h1: ({ node, ...props }) => (
                  <h1
                    className={`text-xl font-bold mt-3 mb-2 ${
                      msg.role === "user" ? "text-white" : "text-gray-900"
                    }`}
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className={`text-lg font-bold mt-3 mb-2 ${
                      msg.role === "user" ? "text-white" : "text-gray-900"
                    }`}
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className={`text-base font-bold mt-2 mb-1 ${
                      msg.role === "user" ? "text-white" : "text-gray-900"
                    }`}
                    {...props}
                  />
                ),

                // Lists
                ul: ({ node, ...props }) => (
                  <ul
                    className={`list-disc list-inside my-2 space-y-1 ${
                      msg.role === "user" ? "text-white" : "text-gray-800"
                    }`}
                    {...props}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    className={`list-decimal list-inside my-2 space-y-1 ${
                      msg.role === "user" ? "text-white" : "text-gray-800"
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
                        className={`px-1.5 py-0.5 rounded font-mono text-sm ${
                          msg.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  // Code block with language
                  return (
                    <div className="my-2 rounded-lg overflow-hidden">
                      <div className="flex justify-between items-center bg-gray-700 px-4 py-2">
                        <span className="font-mono text-xs text-gray-300">
                          {match ? match[1] : "code"}
                        </span>
                        <button
                          className="text-xs text-gray-300 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-600"
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
                        className="!m-0 !p-4 !bg-gray-900 !text-sm"
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
                    className={`underline hover:no-underline ${
                      msg.role === "user"
                        ? "text-blue-200 hover:text-blue-100"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),

                // Blockquotes
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className={`border-l-4 pl-4 italic my-2 ${
                      msg.role === "user"
                        ? "border-blue-400 text-blue-100"
                        : "border-gray-300 text-gray-700"
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
                        ? "border-blue-400"
                        : "border-gray-300"
                    }`}
                    {...props}
                  />
                ),

                // Tables
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-2">
                    <table
                      className={`border-collapse border ${
                        msg.role === "user"
                          ? "border-blue-400"
                          : "border-gray-300"
                      }`}
                      {...props}
                    />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th
                    className={`border px-3 py-2 font-bold text-left ${
                      msg.role === "user"
                        ? "border-blue-400 bg-blue-500/20"
                        : "border-gray-300 bg-gray-100"
                    }`}
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td
                    className={`border px-3 py-2 ${
                      msg.role === "user"
                        ? "border-blue-400"
                        : "border-gray-300"
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

      {/* Loading indicator */}
      {isGenerating && (
        <div className="flex justify-start mb-4">
          <div className="max-w-2xl px-4 py-3 rounded-lg bg-white border border-gray-200 rounded-bl-none">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
              <span className="text-sm text-gray-500">AI is thinking...</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Conversation;
