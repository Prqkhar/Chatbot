import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [messages]);

  async function generateAnswer() {
    if (!question.trim()) return;

    const newMessages = [...messages, { text: question, sender: 'user' }];
    setMessages(newMessages);
    setQuestion("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBk0zNXsTW7Zn_KBZ1Xi82xCegNO6j8olY",
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );

      const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
      setMessages([...newMessages, { text: generatedText, sender: 'bot' }]);
    } catch (error) {
      setMessages([...newMessages, { text: "Error generating response. Please try again.", sender: 'bot' }]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      generateAnswer();
    }
  }

  return (
    <div className="prakhar-chatbot-wrapper">
      <div className="prakhar-chatbot-container">
        <div className="prakhar-chatbot-header">Prakhar's Chatbot</div>
        <div className="prakhar-chatbot-messages" ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`prakhar-chatbot-message ${msg.sender}`}>
              <span>{msg.text}</span>
            </div>
          ))}
          {isLoading && <div className="prakhar-chatbot-message bot">Loading...</div>}
        </div>
        <div className="prakhar-chatbot-input-container">
          <textarea 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Loading..." : "Type your message..."}
            className="prakhar-chatbot-input"
          ></textarea>
          <button onClick={generateAnswer} disabled={isLoading} className="prakhar-chatbot-send">Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
