import { useEffect, useState } from "react";
import { getRequests } from "../../api/requests";

export default function MapPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await getRequests();
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };
  fetchData();
}, []);


const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await getRequests();
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Help Map</h2>

      {requests.map((req) => (
        <div key={req._id}>
          <p>{req.title}</p>
          <p>{req.location?.lat}, {req.location?.lng}</p>
        </div>
      ))}
    </div>
  );
}