import { useEffect, useState } from "react";
import { getRequests } from "../../api/requests";

export default function MapPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRequests();
        console.log("DATA:", res.data); // 🔥 مهم
        setRequests(res.data);
      } catch (err) {
        console.error("API ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading...</p>
       
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Help Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-400">No requests found</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-gray-800 p-4 rounded-xl shadow"
            >
              <h2 className="text-xl font-semibold">{req.title}</h2>
              <p className="text-gray-400">{req.description}</p>
              <p className="text-sm text-gray-500">
                📍 {req.location?.lat}, {req.location?.lng}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}