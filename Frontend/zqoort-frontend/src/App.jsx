import { BrowserRouter, Routes, Route } from "react-router-dom";
import MapPage from "./pages/map/MapPage";
import Login from "./pages/auth/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;