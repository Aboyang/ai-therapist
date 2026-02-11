import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useLocation } from "react-router-dom";
import "../../src/index.css"
import "./ConvoAI.css";
import VoiceIndicator from "./VoiceIndicator";
import BookingButtons from "./BookingButtons";

function ConvoAI() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [dataChannel, setDataChannel] = useState(null);
  const [isDataChannelReady, setIsDataChannelReady] = useState(false);
  const peerConnection = useRef(null);
  const audioElement = useRef(null);
  const navigate = useNavigate()

  const transcript = useRef([]);
  const pendingEvents = useRef([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const userInfo = JSON.parse(params.get("user") || "{}");
  const agentPreferences = JSON.parse(params.get("agent") || "{}");

  console.log({ userInfo, agentPreferences });

  const VOICE_MAP = {
    male: "alloy",
    female: "marin",
    neutral: "alloy",
  };

  // ---------------- START SESSION ----------------
  async function startSession() {
    console.log("Frontend: getting ephemeral token...");
    const tokenResponse = await fetch("http://localhost:8000/convo/token");
    const data = await tokenResponse.json();
    const EPHEMERAL_KEY = data.value;

    const pc = new RTCPeerConnection();

    // Setup remote audio playback
    audioElement.current = document.createElement("audio");
    audioElement.current.autoplay = true;
    pc.ontrack = (e) => (audioElement.current.srcObject = e.streams[0]);

    // Add local microphone
    const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
    pc.addTrack(ms.getTracks()[0]);

    // Setup data channel
    const dc = pc.createDataChannel("oai-events");
    setDataChannel(dc);

    dc.onopen = () => {
      console.log("Data channel open — configuring session");

      setIsSessionActive(true);
      setIsDataChannelReady(true);

      // Flush queued events using the actual dc reference
      pendingEvents.current.forEach(event => dc.send(JSON.stringify(event)));
      pendingEvents.current = [];

      // Configure session
      dc.send(JSON.stringify({
        type: "session.update",
        session: {
          turn_detection: {
            type: "always_listen",
            threshold: 0.5,
            min_speech_duration_ms: 50,
            max_silence_duration_ms: 200,
            audio: { output: { voice: VOICE_MAP[agentPreferences.voice_type] || "marin" } },
          },
          interrupt_response: true,
          input_audio_noise_reduction: { type: "near_field" },
        },
      }));

  // System message
  const systemMessage = {
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "system",
      content: [{
        type: "input_text",
        text: `
          You are a supportive, reflective conversational therapy assistant.

          GOAL:
          - Help the user explore thoughts and emotions safely.
          - Do not diagnose or provide medical advice.
          - Listen, validate, and ask one thoughtful, open-ended question at a time.
          - Prioritize emotional safety.

          USER CONTEXT:
          - Age: ${userInfo.age}
          - Gender: ${userInfo.gender}
          - Main Concern: ${userInfo.concerns?.join(", ")}

          AGENT PREFERENCES:
          - Speaking Style: ${agentPreferences.style}
        `
      }],
    },
  };

  dc.send(JSON.stringify(systemMessage));
  dc.send(JSON.stringify({ type: "response.create" }));
};

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const sdpResponse = await fetch(
      `https://api.openai.com/v1/realtime/calls?model=gpt-realtime`,
      {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      }
    );

    const sdp = await sdpResponse.text();
    await pc.setRemoteDescription({ type: "answer", sdp });

    peerConnection.current = pc;
  }

  // ---------------- STOP SESSION ----------------
  function stopSession() {
    if (dataChannel) dataChannel.close();
    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach((s) => s.track?.stop());
      peerConnection.current.close();
    }

    // Log the full convo
    console.log("Full conversation log:", transcript.current);

    setIsSessionActive(false);
    setIsDataChannelReady(false);
    setDataChannel(null);
    peerConnection.current = null;
  }

  // ---------------- SEND EVENT ----------------
  function sendClientEvent(message, force = false) {
    const timestamp = new Date().toLocaleTimeString();
    message.event_id = message.event_id || crypto.randomUUID();
    if (!message.timestamp) message.timestamp = timestamp;

    // If no data channel yet, queue it
    if (!dataChannel || (!isDataChannelReady && !force)) {
      pendingEvents.current.push(message);
      console.warn("Data channel not ready — queued event:", message);
      return;
    }

    dataChannel.send(JSON.stringify(message));
    // conversationEvents.current.push({ ...message, direction: "outgoing", timestamp });
    // console.log("[OUTGOING]", timestamp, message);
  }

  // ---------------- HANDLE ASSISTANT TRANSCRIPT ----------------
  useEffect(() => {
    if (!dataChannel) return;

    const handleMessage = (e) => {
      const event = JSON.parse(e.data)
      if (event.type != "response.done") return

      // Extract payload safely
      console.log(event)
      const text = event.response.output[0].content[0].transcript
      const role = "assistant"
      const timestamp = event.timestamp

      // Log to console
      console.log("[INCOMING]", timestamp, role, text)

      // Save to ref
      transcript.current.push({ timestamp, role, text })
    };

      dataChannel.addEventListener("message", handleMessage);
      dataChannel.addEventListener("open", () => setIsSessionActive(true));

      return () => {
        dataChannel.removeEventListener("message", handleMessage);
      };
  }, [dataChannel])

  async function generateSummary() {
    try {
      const response = await fetch("http://localhost:8000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: userInfo.age,
          gender: userInfo.gender,
          concerns: userInfo.concerns,
          conversation_context: transcript.current
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();

      console.log("Summary URL:", data.summary_url);

      // Optional: open in new tab
      window.open(data.summary_url, "_blank");

    } catch (error) {
      console.error("Error generating summary:", error);
    }
  }

  return (
    <div className="flex-col centerer-flex voice-container">
      {isSessionActive && <VoiceIndicator />}
      {transcript.current.length == 0 &&
        <button
          onClick={() => {
            if (isSessionActive) stopSession();
            else startSession();
          }}
          className={isSessionActive ? "btn-active btn-large" : "btn-primary btn-large"}
        >
          {isSessionActive ? "Stop Session" : "Launch Session"}
        </button>
      }
      
      {transcript.current.length > 0 && (
        <div className="booking-btns">
        <button
          className="btn-primary btn-large"
          onClick={generateSummary}
        >
          Show Summary
        </button>
        <button
          className="btn-primary btn-large"
          onClick={() => navigate("/book-appointment")}
        >
          Book Appointment
        </button>
        </div>
      )}
    </div>
  );
}

export default ConvoAI;
