import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { List, X } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Suggest from "./components/Suggest";
import ProtectedRoute from "./components/ProtectedRoute";
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
              <MainLayout>
                <Home />
              </MainLayout>
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
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/:username"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Users />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className={`col-lg-3 ${isSidebarOpen ? 'd-block position-fixed h-100 bg-black overflow-auto' : 'd-none d-lg-block'}`} style={{ zIndex: 1050, width: isSidebarOpen ? '100vw' : '250px' }}>
          <Sidebar className={isSidebarOpen ? 'p-0' : ''} setIsSidebarOpen={setIsSidebarOpen} />
        </div>
        {isSidebarOpen && (
          <div
            className="d-block d-lg-none position-fixed w-100 h-100 bg-dark opacity-50"
            onClick={toggleSidebar}
            style={{ zIndex: 1040 }}
          ></div>
        )}
        <div className="col-12 col-lg-6">
          {isSidebarOpen ? (
            <button
              className="btn btn-dark d-lg-none"
              onClick={toggleSidebar}
              style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1060 }}
            >
              <X className="text-white" />
            </button>
          ) : (
            <button
              className="btn btn-dark d-lg-none mb-3"
              onClick={toggleSidebar}
              style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 1000 }}
            >
              <List className="text-white" />
            </button>
          )}
          {children}
        </div>
        <div className="col-lg-3 d-none d-lg-block">
          <Suggest />
        </div>
      </div>
    </div>
  );
}