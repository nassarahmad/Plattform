import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users").then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Points</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}