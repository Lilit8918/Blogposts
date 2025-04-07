const { useState } = React;

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    const newMessages = [...messages, { sender: "user", text: userMessage }];
    setMessages(newMessages);
    setUserMessage("");
    setTimeout(() => {
      setMessages([...newMessages, { sender: "bot", text: "Hello! I’m a bot!" }]);
    }, 500);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Chatbot</h2>
      <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "auto", marginBottom: "10px", padding: "10px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <p><strong>{msg.sender}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type something..."
        style={{ width: "70%" }}
      />
      <button onClick={handleSendMessage} style={{ marginLeft: "10px" }}>Send</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ChatBot />);
