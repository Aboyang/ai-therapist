import { useRef, useState } from "react"
import ChatMessage from "./ChatMessage"
import ChatInput from "./ChatInput"
import './Chat.css'

const recommendedQuestions = [
  "How is Jayden progressing in his current situation??",
  "What similarities exist among patients exhibiting anxiety in young adulthood?",
  "What patterns or triggers have been observed in patients with recurring depressive episodes?",
  "Which coping strategies have been most effective for patients experiencing high stress?"
]

async function streamChat(prompt, onChunk, onDone) {
  const res = await fetch("http://localhost:8000/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  })

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let text = ""

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    text += decoder.decode(value, { stream: true })
    onChunk(text)
  }

  onDone?.()
}

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [streaming, setStreaming] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const assistantIndexRef = useRef(null)

  async function handleSend(text) {
    if (!text.trim()) return

    const userMsg = { role: "user", content: text }
    const assistantMsg = { role: "assistant", content: "" }

    setMessages(prev => {
      const newMsgs = [...prev, userMsg, assistantMsg]
      assistantIndexRef.current = newMsgs.length - 1
      return newMsgs
    })

    setInputValue("")
    setStreaming(true)

    await streamChat(
      text,
      chunk => {
        setMessages(prev => {
          const copy = [...prev]
          copy[assistantIndexRef.current] = {
            role: "assistant",
            content: chunk
          }
          return copy
        })
      },
      () => setStreaming(false)
    )
  }

  const handleRecommendedClick = question => {
    setInputValue(question) // sets input so you can edit it or send
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="recommended-grid">
            {recommendedQuestions.map((q, i) => (
              <button
                key={i}
                className="recommended-btn"
                onClick={() => handleRecommendedClick(q)}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <ChatMessage
            key={i}
            role={m.role}
            content={m.content}
            streaming={streaming && i === assistantIndexRef.current}
          />
        ))}
      </div>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}           // directly controlled
        onSend={() => handleSend(inputValue)}
        disabled={streaming}
      />
    </div>
  )
}
