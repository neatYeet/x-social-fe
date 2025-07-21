import { MessageCircle, Repeat2, Heart, ChartNoAxesColumn } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ForYou() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [followStatuses, setFollowStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const currentUserId = parseInt(Cookies.get("id"));
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/posts", { withCredentials: true })
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3000/api/v1/users").then((res) => {
      const filtered = res.data.filter((u) => u.id !== currentUserId);
      setUsers(filtered);
      fetchFollowStatuses(filtered);
    });
  }, [currentUserId]);

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
    const map = {};
    results.forEach(({ username, status, isRequester }) => {
      map[username] = { status, isRequester };
    });
    setFollowStatuses(map);
  };

  const handleFollow = async (username) => {
    try {
      await axios.post(
        `http://localhost:3000/api/v1/users/${username}/follow`,
        {},
        { withCredentials: true }
      );
      Swal.fire({
        title: "Followed!",
        text: `You are now following @${username}`,
        icon: "success",
        confirmButtonColor: "#000",
      });
      fetchFollowStatuses(users);
    } catch (err) {
      alert("Failed to follow", err);
    }
  };

  const handleAccept = async (username) => {
    try {
      await axios.put(
        `http://localhost:3000/api/v1/users/${username}/follow/accept`,
        {},
        { withCredentials: true }
      );
      Swal.fire({
        title: "Follow Accepted",
        text: `You and @${username} are now connected`,
        icon: "success",
        confirmButtonColor: "#000",
      });
      fetchFollowStatuses(users);
    } catch (err) {
      alert("Failed to accept follow request", err);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const postUser = post.user;
    if (!postUser) return false;
    const isOwnPost = postUser.id === currentUserId;
    const isPublic = postUser.is_private === false || postUser.is_private === 0;
    const isPrivateFollowed =
      (postUser.is_private === true || postUser.is_private === 1) &&
      post.status === "following";
    return isOwnPost || isPublic || isPrivateFollowed;
  });

  return (
    <div className="post-container d-flex flex-column align-items-center mt-3 postcard">
      <div className="border border-dark postcard rounded p-3 w-auto">
        <div className="mb-3 border-bottom border-dark">
          <h1 className="text-white fs-5 p-1">Who To Follow</h1>
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
                buttonText = "Following";
                isDisabled = true;
              } else if (status === "requested") {
                if (isRequester) {
                  buttonText = "Requested";
                  isDisabled = true;
                } else {
                  buttonText = "Requested";
                  isAcceptAction = true;
                }
              }

              const handleClick = () => {
                if (isAcceptAction) {
                  handleAccept(user.username);
                } else {
                  handleFollow(user.username);
                }
              };

              return (
                <div
                  className="d-flex align-items-center justify-content-between mb-3"
                  key={user.id}
                >
                  <button
                    className="d-flex mt-4 border-0 bg-black"
                    onClick={() => navigate(`/${user.username}`)}
                  >
                    <div
                      className="rounded-circle bg-white d-flex border-0 justify-content-center align-items-center"
                      style={{ width: "40px", height: "40px", fontWeight: "bold" }}
                    >
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ms-1 suggest-username text-start">
                      <h2 className="text-white fs-6 mb-0">{user.full_name}</h2>
                      <h2 className="text-white opacity-50 fs-6">@{user.username}</h2>
                    </div>
                  </button>
                  <button
                    className={`mt-3 rounded-4 fw-bold border-0 ${
                      isDisabled
                        ? "bg-white text-dark"
                        : "bg-dark text-white border border-light"
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

        <h1 className="text-white fs-5 p-1 mb-3">Post For You</h1>
        <div>
          {loading ? (
            <p className="text-white text-center mt-5">Loading posts...</p>
          ) : filteredPosts.length === 0 ? (
            <p className="text-white text-center mt-5">No posts available.</p>
          ) : (
            filteredPosts.map((post) => (
              <div
                className="post-container d-flex flex-column align-items-center mt-3 postcard"
                key={post.id}
              >
                <div className="border border-dark postcard rounded p-3 w-auto">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-white d-flex justify-content-center align-items-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        fontWeight: "bold",
                      }}
                    >
                      {post?.user?.full_name?.charAt(0) || "?"}
                    </div>
                    <div className="ms-2 post-text">
                      <h2 className="text-white mb-0">
                        {post?.user?.full_name || "Unknown"}
                      </h2>
                      <h2 className="text-white fw-normal">{post.caption}</h2>
                    </div>
                  </div>

                  {post.attachment && (
                    <div className="fs-5 fw-medium d-flex flex-column mt-2">
                      <img
                        src={post.attachment}
                        alt="Post"
                        className="rounded-1"
                        style={{
                          maxHeight: "500px",
                          objectFit: "cover",
                          width: "500px",
                        }}
                      />
                    </div>
                  )}

                  <div className="text-white w-100 mt-3 d-flex justify-content-around post-action">
                    <h1>
                      <MessageCircle size={20} /> 28
                    </h1>
                    <h1>
                      <Repeat2 size={20} /> 510
                    </h1>
                    <h1>
                      <Heart size={20} /> 41,2K
                    </h1>
                    <h1>
                      <ChartNoAxesColumn size={20} /> 2M
                    </h1>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
