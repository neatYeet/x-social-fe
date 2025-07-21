import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Suggest from "./components/Suggest";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Import ini
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./components/UserProfile";
import Users from "./pages/Users";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Explore />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/:username" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
function MainLayout({ children }) {
  return (
    <div className="d-flex bg-black">
      <Sidebar />
      <div className="flex-grow-1 p-3">{children}</div>
      <Suggest />
    </div>
  );
}