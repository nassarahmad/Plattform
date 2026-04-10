import { useEffect, useState } from "react";
import { getRequests } from "../../api/requests";

export default function MapPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRequests();
        setRequests(res.data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Help Requests</h2>

      {requests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        requests.map((req) => (
          <div key={req._id}>
            <p>{req.title}</p>
            <p>{req.location?.lat}, {req.location?.lng}</p>
          </div>
        ))
      )}
    </div>
  );
}