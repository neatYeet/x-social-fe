import { useState } from "react";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import Suggest from "../components/Suggest";
import { List } from "lucide-react";


export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        {/* Sidebar for large screens, and conditionally shown on small screens */}
        {/* Sidebar for large screens, and conditionally shown on small screens */}
        <div className={`col-lg-3 ${isSidebarOpen ? 'd-block position-fixed h-100 bg-black' : 'd-none d-lg-block'}`} style={{ zIndex: 1050, width: isSidebarOpen ? '100vw' : '250px' }}>
          <Sidebar className={isSidebarOpen ? 'p-0' : ''} />
        </div>
        {isSidebarOpen && (
          <div
            className="d-block d-lg-none position-fixed w-100 h-100 bg-dark opacity-50"
            onClick={toggleSidebar}
            style={{ zIndex: 1040 }}
          ></div>
        )}
        <div className="col-12 col-lg-6">
          {/* Toggle button for sidebar on small screens */}
          <button
            className="btn btn-dark d-lg-none mb-3"
            onClick={toggleSidebar}
            style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 1000 }}
          >
            <List className="text-white" />
          </button>
          <CreatePost />
          <Post />
        </div>
        <div className="col-lg-3 d-none d-lg-block">
          <Suggest />
        </div>
      </div>
    </div>
  );
}