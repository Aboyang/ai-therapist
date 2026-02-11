import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './BookingButtons.css'

export default function BookingButtons({ transcript }) {
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState("");
  const summaryRef = useRef(null);

  const generateSummary = () => {
    const generated = `
- Age: 21
- Gender: Female
- Main Concern: Relationship, Depression

Any Relevant Conversation Stages (Story Lines)
- Stage 1: Patient expresses grief over the loss of a long term relationship.
- Stage 2: Patient shares the impact of the stress that it creates on her especially having to juggle her academics at the same time.
- Stage 3: Patient finds that she has attached her self-worth and identity to the relationship, losing which, has caused her to feel as if a part of her is taken.

- Action Points
- Seek emotional support, such as talking to a close friend, family member, or counselor.
- Separate self-worth from relationship outcomes, focusing on personal strengths and achievements.
- Practice stress management strategies: journaling, mindfulness, or short study breaks.
- Attend study groups or consult a tutor to reduce academic anxiety.
- Does the patient feel better towards the end?

Yes, the patient is open to taking steps to improve their situation.
    `;
    setSummary(generated);
    setShowSummary(prev => !prev);
  };

  // Adjust the height for smooth animation
  useEffect(() => {
    if (summaryRef.current) {
      if (showSummary) {
        const scrollHeight = summaryRef.current.scrollHeight;
        summaryRef.current.style.height = scrollHeight + "px";
      } else {
        summaryRef.current.style.height = "0px";
      }
    }
  }, [showSummary, summary]);

  return (
    <div>
        <div className="booking-btns">
          {/* Expandable Summary Button */}
          <div>
            <button
              className="btn-primary btn-large"
              onClick={generateSummary}
            >
              {showSummary ? "Hide Summary" : "Show Summary"}
            </button>
            <div
              ref={summaryRef}
              className="summary-panel"
              style={{ height: "0px" }}
            >
              <pre>{summary || "Generating summary..."}</pre>
            </div>
          </div>

          {/* Book Appointment Button */}
          <button
            className="btn-primary btn-large"
            onClick={() => navigate("/book-appointment")}
          >
            Book Appointment
          </button>
        </div>
    </div>
  );
}
