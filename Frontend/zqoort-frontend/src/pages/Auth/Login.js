import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
  import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(form);
      navigate("/"); 

  };




  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <input placeholder="Password" type="password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
      <button>Login</button>
    </form>
  );
}