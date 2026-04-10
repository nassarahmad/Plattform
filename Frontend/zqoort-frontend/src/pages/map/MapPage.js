import { useEffect, useState } from "react";
import { getRequests } from "../../api/requests";

export default function MapPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getRequests();
      setRequests(res.data);
    };
    fetchData();
  }, []);

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