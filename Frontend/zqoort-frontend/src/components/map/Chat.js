import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Chat() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.connect();

    socket.on("receive_message", (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    socket.emit("send_message", msg);
    setMessages(prev => [...prev, msg]);
    setMsg("");
  };

  return (
    <div>
      <h3>Chat</h3>

      <div>
        {messages.map((m, i) => <p key={i}>{m}</p>)}
      </div>

      <input value={msg} onChange={e => setMsg(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}