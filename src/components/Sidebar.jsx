import {
  House,
  Search,
  Bell,
  Mail,
  CircleSlash2,
  X,
  UsersRound,
  UserRound,
  CircleEllipsis,
  Camera,
} from "lucide-react";
import imgLogo from "../assets/xlogo.webp";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import api from "../utils/api";

export default function Sidebar({ setIsSidebarOpen }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const location = useLocation();

  const [showDropup, setShowDropup] = useState(false);
  const handleToggleDropup = () => setShowDropup(!showDropup);

  const handleLogout = () => {
    Swal.fire({
      title: "Do you want to logout?",
      showDenyButton: true,
      confirmButtonText: "Logout",
      denyButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("refresh_token");
        Cookies.remove("id");

        Swal.fire("Logout Success!", "", "success");
        navigate("/login");
      } else if (result.isDenied) {
        Swal.fire("Cancelled Logout");
      }
    });
  };

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!caption && !file) {
      return Swal.fire({
        icon: "warning",
        title: "Empty Post",
        text: "Caption or image is required.",
      });
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (file) formData.append("file", file);

    try {
      await api.post("/posts", formData, { headers: { "Content-Type": "multipart/form-data" }, });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Post uploaded successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setCaption("");
      setFile(null);
      setPreview(null);
      handleClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.response?.data?.message || "Something went wrong!",
      });
    }
  };

  const activeClass = `text-info bg-white`;

  const [profile, setProfile] = useState({});
  const userId = Cookies.get("id");

  useEffect(() => {
    if (userId) {
      api
        .get("/user")
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [userId]);


  const isMobile = () => window.innerWidth < 992;

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile()) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="sidebar d-flex flex-column p-1 align-items-start border-end border-dark bg-black">
      <img src={imgLogo} className="w-25 mb-3" alt="Logo" />

      <button onClick={() => handleNavigation("/")} className={location.pathname === '/' ? activeClass : ''}>
        <House className="me-2" /> Home
      </button>
      <button onClick={() => handleNavigation("/explore")} className={location.pathname === '/explore' ? activeClass : ''}>
        <Search className="me-2" /> Explore
      </button>
      <button>
        <Bell className="me-2" /> Notifications
      </button>
      <button>
        <Mail className="me-2" /> Messages
      </button>
      <button>
        <CircleSlash2 className="me-2" /> Grok
      </button>
      <button>
        <UsersRound className="me-2" /> Communities
      </button>
      <button>
        <X className="me-2" /> Premium
      </button>
      <button
        className={location.pathname === `/profile/${profile.username}` ? activeClass : ''}
        onClick={() =>
          profile.username && handleNavigation(`/profile/${profile.username}`)
        }
      >
        <UserRound className="me-2" /> Profile
      </button>

      <button>
        <CircleEllipsis className="me-2" /> More
      </button>

      <button onClick={handleShow} className="btn-post mt-2">
        Post
      </button>

      <div className="position-relative w-100 mt-auto">
        <button className="d-flex w-100" onClick={handleToggleDropup}>
          <div
            className="rounded-circle bg-white d-flex"
            style={{ width: "60px", height: "60px", fontWeight: "bold" }}
          ></div>
          <div className="ms-2 text-start">
            <h2 className="fs-5 text-white">{profile.full_name}</h2>
            <h2 className="fs-6 text-white opacity-50">@{profile.username}</h2>
          </div>
        </button>

        {showDropup && (
          <div
            className="position-absolute w-100 bg-black border border-dark rounded-4 p-2"
            style={{ bottom: "70px", zIndex: 1000 }}
          >
            <button
              className="w-100 text-start btn btn-link text-white text-decoration-none"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="bg-black border-0" />
        <Modal.Body className="bg-black">
          <form onSubmit={handleUpload}>
            <div className="border border-dark postcard rounded p-3 w-100">
              <div className="d-flex mb-3">
                <div
                  className="rounded-circle bg-white d-flex justify-content-center align-items-center me-2"
                  style={{ width: "40px", height: "40px", fontWeight: "bold" }}
                ></div>
                <textarea
                  className="form-control bg-black border-0 text-white"
                  placeholder="What's happening?"
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  required={!file}
                />
              </div>

              {preview && (
                <div className="mb-3">
                  <img
                    src={preview}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center">
                <label className="btn text-primary w-75 m-0">
                  <Camera size={20} className="me-3" />
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            <Modal.Footer className="bg-black border-top border-dark">
              <Button
                type="submit"
                variant="white"
                className="bg-white rounded-4 text-black fw-bold"
              >
                Post
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
