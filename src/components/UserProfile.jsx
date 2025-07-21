import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";

const UserProfile = () => {
  const { username } = useParams();
  const currentUserId = parseInt(Cookies.get("id"));
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [followStatus, setFollowStatus] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [modalUsers, setModalUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/users/${username}`)
      .then((res) => {
        setProfile(res.data);
        fetchFollowStatus(res.data.username);
        fetchPosts(res.data.username);
        fetchFollowCounts();
      })
      .catch((err) => console.error(err));
  }, [username]);

  const fetchFollowStatus = (username) => {
    axios
      .get(`http://localhost:3000/api/v1/users/${username}/follow-status`, {
        withCredentials: true,
      })
      .then((res) => setFollowStatus(res.data.status))
      .catch((err) => console.error(err));
  };

  const fetchPosts = (targetUsername) => {
    axios
      .get("http://localhost:3000/api/v1/posts", { withCredentials: true })
      .then((res) => {
        const filtered = res.data.filter((post) => {
          const postUser = post.user;
          if (!postUser || postUser.username !== targetUsername) return false;

          const isOwnPost = postUser.id === currentUserId;
          const isPublic =
            postUser.is_private === false || postUser.is_private === 0;
          const isPrivateFollowed =
            (postUser.is_private === true || postUser.is_private === 1) &&
            post.status === "following";

          return isOwnPost || isPublic || isPrivateFollowed;
        });

        setPosts(filtered);
      })
      .catch((err) => console.error("Gagal mengambil post:", err));
  };

  const handleFollow = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/v1/users/${username}/follow`,
        { iduser: currentUserId },
        { withCredentials: true }
      );
      fetchFollowStatus(username);
      Swal.fire("Success", `You followed @${username}`, "success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/users/${username}/unfollow`,
        { withCredentials: true }
      );
      fetchFollowStatus(username);
    } catch (err) {
      console.error(err);
    }
  };

  const renderFollowButton = () => {
    if (profile.id === currentUserId) return null;

    if (followStatus === "following") {
      return (
        <button
          className="btn btn-sm btn-light text-dark rounded-pill px-3"
          onClick={handleUnfollow}
        >
          Following
        </button>
      );
    } else if (followStatus === "requested") {
      return (
        <button
          className="btn btn-sm btn-secondary rounded-pill px-3"
          onClick={handleUnfollow}
        >
          Requested
        </button>
      );
    } else {
      return (
        <button
          className="btn btn-sm btn-outline-light rounded-pill px-3"
          onClick={handleFollow}
        >
          Follow
        </button>
      );
    }
  };

  const fetchFollowCounts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/users/${username}/follow-count`,
        { withCredentials: true }
      );
      setFollowersCount(res.data.followersCount ?? 0);
      setFollowingCount(res.data.followingCount ?? 0);
    } catch (err) {
      console.error("Error fetching follow count:", err);
    }
  };

  const openModal = async (title) => {
    setModalTitle(title);
    setShowModal(true);

    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/users/${username}/follow-count`,
        { withCredentials: true }
      );
      const list =
        title === "Followers" ? res.data.followers : res.data.following;
      setModalUsers(list || []);
    } catch (err) {
      console.error(`Error fetching ${title.toLowerCase()}:`, err);
      setModalUsers([]);
    }
  };

  return (
    <div className="bg-black text-white min-vh-100 postcard border-dark border">
      <div className="bg-secondary" style={{ height: "160px" }}></div>
      <div className="container position-relative" style={{ marginTop: "-80px" }}>
        <div
          className="rounded-circle bg-primary d-flex align-items-center justify-content-center border border-4 border-dark"
          style={{ width: "130px", height: "130px", fontSize: "3rem" }}
        >
          {profile.full_name?.charAt(0) || "?"}
        </div>
        <div className="d-flex justify-content-end gap-2 mt-2">
          {renderFollowButton()}
        </div>
        <h4 className="mt-2 mb-0">{profile.full_name}</h4>
        <div className="text-white opacity-50 mb-2">@{username}</div>
        <div className="text-white mt-1 d-flex opacity-50">
          <Calendar className="me-2" />
          Joined{" "}
          {profile.createdAt
            ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })
            : ""}
        </div>
        <div>
          <button
            onClick={() => openModal("Following")}
            className="btn text-white"
          >
            {followingCount} Following
          </button>
          <button
            onClick={() => openModal("Followers")}
            className="btn text-white"
          >
            {followersCount} Followers
          </button>
        </div>
      </div>

      <div className="container mt-4">
        {posts.length > 0 ? (
          <>
            <h5>@{username}'s Posts</h5>
            {posts.map((post) => (
              <div
                key={post.id}
                className="text-white p-3 my-2 border-dark border rounded position-relative"
              >
                <div className="fw-bold">@{profile.username}</div>
                <div className="my-2">{post.caption || post.content}</div>
                {post.attachment && (
                  <img
                    src={post.attachment}
                    alt="Attachment"
                    className="img-fluid rounded mb-2"
                    style={{ maxHeight: "400px", objectFit: "cover" }}
                  />
                )}
                <div className="text-white small">
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-white-50 text-center mt-5">Akun ini privat</p>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-black text-white border-dark">
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-black text-white">
          {modalUsers.length === 0 ? (
            <p>No {modalTitle.toLowerCase()} found.</p>
          ) : (
            modalUsers.map((user) => (
              <div
                key={user.id}
                className="d-flex justify-content-between align-items-center mb-3 border-bottom border-dark pb-2"
              >
                <div>@{user.username}</div>
              </div>
            ))
          )}
        </Modal.Body>
        <Modal.Footer className="bg-black">
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            className="fw-bold"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserProfile;
