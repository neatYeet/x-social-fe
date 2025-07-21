import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Suggest() {
  const [users, setUsers] = useState([]);
  const [followStatuses, setFollowStatuses] = useState({});
  const currentUserId = parseInt(Cookies.get("id"));
  const navigate = useNavigate();

  const fetchFollowStatuses = async (userList) => {
    const results = await Promise.all(
      userList.map((user) =>
        axios
          .get(`http://localhost:3000/api/v1/users/${user.username}/follow-status`, {
            withCredentials: true,
          })
          .then((res) => ({
            username: user.username,
            status: res.data.status,
            isRequester: res.data.isRequester,
          }))
          .catch(() => ({
            username: user.username,
            status: null,
            isRequester: false,
          }))
      )
    );

    const statusMap = {};
    results.forEach(({ username, status, isRequester }) => {
      statusMap[username] = { status, isRequester };
    });
    setFollowStatuses(statusMap);
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/v1/users").then((res) => {
      const filteredUsers = res.data.filter((u) => u.id !== currentUserId);
      setUsers(filteredUsers);
      fetchFollowStatuses(filteredUsers);
    });
  }, [currentUserId]);

  const handleFollow = async (username) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/users/${username}/follow`,
        {},
        { withCredentials: true }
      );
      Swal.fire({
        title: "Followed!",
        text: res.data.message,
        icon: "success",
        confirmButtonColor: "#000",
      });
      fetchFollowStatuses(users);
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || "Failed to follow";
      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonColor: "#000",
      });
      if (status === 401) navigate("/login");
    }
  };

  const handleAccept = async (username) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/v1/users/${username}/follow/accept`,
        {},
        { withCredentials: true }
      );
      Swal.fire({
        title: "Accepted!",
        text: res.data.message,
        icon: "success",
        confirmButtonColor: "#000",
      });
      fetchFollowStatuses(users);
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err?.response?.data?.message || "Failed to accept follow request",
        icon: "error",
        confirmButtonColor: "#000",
      });
    }
  };

  const handleNavigateProfile = (username) => {
    navigate(`/${username}`);
  };

  return (
    <div className="p-3 border border-dark rounded-4 mt-3 suggest">
      <h1 className="text-white fs-4">Who To Follow</h1>
      <div className="border-2 border-dark suggest-card">
        {users.length === 0 ? (
          <p className="text-white text-center mt-5">No users available.</p>
        ) : (
          users.map((user) => {
            const followInfo = followStatuses[user.username] || {};
            const { status, isRequester } = followInfo;

            let buttonText = "Follow";
            let isDisabled = false;
            let isAcceptAction = false;

            if (status === "following") {
              buttonText = "Friends";
              isDisabled = true;
            } else if (status === "requested") {
              if (isRequester) {
                buttonText = "Requested";
                isDisabled = true;
              } else {
                buttonText = "Requested";
                isAcceptAction = true;
                isDisabled = true;
              }
            }

            const handleClick = () => {
              if (status === "requested" && !isRequester) {
                handleAccept(user.username);
              } else if (!status) {
                handleFollow(user.username);
              }
            };

            return (
              <div
                className="d-flex align-items-center justify-content-between"
                key={user.id}
              >
                <button
                  className="d-flex mt-4 border-0 bg-black"
                  onClick={() => handleNavigateProfile(user.username)}
                >
                  <div
                    className="rounded-circle bg-white d-flex border-0"
                    style={{ width: "40px", height: "40px", fontWeight: "bold" }}
                  ></div>
                  <div className="ms-1 suggest-username text-start">
                    <h2 className="text-white fs-6 mb-0">{user.full_name}</h2>
                    <h2 className="text-white opacity-50 fs-6">@{user.username}</h2>
                  </div>
                </button>

                <button
                  className={`mt-3 rounded-4 fw-bold border-0 ${isAcceptAction
                      ? "bg-dark text-white"
                      : isDisabled
                        ? "bg-white text-dark"
                        : "bg-dark text-white"
                    }`}
                  style={{ width: "100px", height: "35px" }}
                  onClick={handleClick}
                  disabled={isDisabled}
                >
                  {buttonText}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
