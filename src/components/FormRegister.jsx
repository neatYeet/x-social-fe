import { useState } from "react";
import imgLogo from "../assets/xlogo.webp";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function FormRegister() {
  const [isPrivate, setisPrivate] = useState(false);
  const [username, setUsername] = useState("");
  const [full_name, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
await axios.post("http://localhost:3000/api/v1/auth/register", {
  username,
  full_name,
  password,
  bio,
  is_private: isPrivate,
});


      Swal.fire({
        icon: "success",
        title: "Register Berhasil!",
        text: "Silakan login sekarang.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Register Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow bg-black border-dark border-2 rounded-5 mt-5 mb-5"
        style={{ width: "75vh" }}
      >
        <div className="text-center mb-4">
          <img src={imgLogo} alt="Admin Logo" style={{ width: "80px" }} />
        </div>
        <h3 className="text-center mb-3 text-white">Register</h3>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control bg-black border-dark text-white"
              placeholder="Full Name"
              value={full_name}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control bg-black border-dark text-white"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              type="text"
              className="form-control bg-black border-dark text-white"
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control bg-black border-dark text-white"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-check form-switch mb-2 ms-2">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="switchCheckDefault"
              checked={isPrivate}
              onChange={(e) => setisPrivate(e.target.checked)}
            />
            <label
              className="form-check-label text-white"
              htmlFor="switchCheckDefault"
            >
              Private
            </label>
          </div>

          <button
            type="submit"
            className="btn bg-white opacity-75 fw-bold text-black w-100 rounded-5"
          >
            Register
          </button>
        </form>
        <div className=" mt-3 text-center text-white">
          Have an account??{" "}
          <span>
            <a href="/login" className="text-decoration-none">
              Login
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
