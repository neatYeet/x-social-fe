import { useState } from "react";
import imgLogo from "../assets/xlogo.webp";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../utils/api";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export default function FormLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("refresh_token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/auth/login",
        {
          username,
          password,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        timer: 2000,
        showConfirmButton: false,
      });

      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("id", response.data.user.id);

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
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
        <h3 className="text-center mb-3 text-white">Login</h3>
        <form onSubmit={loginHandler}>
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
            <input
              type="password"
              className="form-control bg-black border-dark text-white"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn bg-white opacity-75 fw-bold text-black w-100 rounded-5"
          >
            Login
          </button>
        </form>
        <div className=" mt-3 text-center text-white">
          Don't have an account??{" "}
          <span>
            <a href="/register" className="text-decoration-none">
              Register
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
