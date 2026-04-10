import { useState } from "react";
import useLocation from "../hooks/useLocation";

export default function CreateRequest({ onCreate }) {
  const location = useLocation();
  const [message, setMessage] = useState("");

  const handleCreate = () => {
    if (!location) return alert("Location not ready");

    onCreate({
      id: Date.now(),
      user: "You",
      ...location,
      message,
    });

    setMessage("");
  };

  return (
    <div>
      <input
        placeholder="Describe your problem..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleCreate}>طلب مساعدة</button>
    </div>
  );
}