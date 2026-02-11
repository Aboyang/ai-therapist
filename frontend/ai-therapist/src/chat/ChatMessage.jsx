import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function sanitizeMarkdown(md) {
  const fences = (md.match(/```/g) || []).length
  if (fences % 2 !== 0) {
    return md + "\n```"
  }
  return md
}

export default function ChatMessage({ role, content, streaming }) {
  const isUser = role === "user"

  return (
    <div className={`chat-message-wrapper ${isUser ? "user-wrapper" : "assistant-wrapper"}`}>
      <div className={`chat-message ${isUser ? "user" : "assistant"}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {sanitizeMarkdown(content)}
        </ReactMarkdown>
        {streaming && <span className="streaming-cursor">▍</span>}
      </div>
    </div>
  )
}
