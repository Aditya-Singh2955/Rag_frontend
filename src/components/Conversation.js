import React, { useState, useEffect , useRef} from "react";
import "../styles/Conversation.css";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from 'axios';

const Conversation = () => {
    const fileRef = React.useRef();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [modal, setModal] = useState(false);

  const handleSend = async () => {
  if (!input.trim()) return;

  const question = input;

  setMessages((prev) => [
    ...prev,
    {
      text: question,
      sender: "user",
    },
  ]);

  setInput("");

  try {
    const { data } = await axios.post(
      "https://rag-backend-1kem.onrender.com/api/chat",
      {
        question,
      }
    );

    setMessages((prev) => [
      ...prev,
      {
        text: data.answer,
        sender: "bot",
      },
    ]);
  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        text: "Something went wrong.",
        sender: "bot",
      },
    ]);
  }
};

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleMic = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };
  

  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await axios.post(
      "https://rag-backend-1kem.onrender.com/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(data);

    setMessages((prev) => [
      ...prev,
      {
        text: `✅ ${file.name} uploaded successfully`,
        sender: "user",
      },
    ]);
  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        text: "File upload failed.",
        sender: "bot",
      },
    ]);
  }

  e.target.value = "";
};

  return (
    <div className="container">
      {/* TITLE */}
      <div className="header_text">
        <h1>Upload Document Aura Ai will Provide Precision Solutions</h1>
        <p>How can Aura assist your workflow today?</p>
      </div>

      {/* CHAT AREA */}
      <div className="chat_area">
        {messages?.map((msg, index) => (
          <div
            className={`message ${msg.sender === "user" ? "user" : "bot"}`}
            key={index}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="input_area">
        <AttachFileIcon className="icon" onClick={() => fileRef.current.click()} />
        <input
          type="text"
          placeholder="Ask Aura anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <input
          type="file"
          ref={fileRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <button
          className={`send_btn ${listening ? "listening" : ""}`}
          onClick={handleMic}
        >
          <KeyboardVoiceIcon />
        </button>
        <button
          className="send_btn"
          onClick={handleSend}
          
        >
          <SendIcon />
        </button>
      </div>

      <p className="footer_note">
        Aura AI may provide inaccurate info. Verify important details.
      </p>
    </div>
  );
};

export default Conversation;
