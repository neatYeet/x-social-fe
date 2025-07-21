import React, { useEffect, useState } from "react";
import { Calendar, Trash2, Lock, Unlock } from "lucide-react";
import ProfileAct from "./ProfileAct";
import Follow from "./Follow";
import axios from "axios";
import Cookies from "js-cookie";
import { Modal, Button, Form } from "react-bootstrap";

const TwitterProfile = () => {
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const userId = Cookies.get("id");

  useEffect(() => {
    if (userId) {
      axios
        .get("http://localhost:3000/api/v1/user", { withCredentials: true })
        .then((res) => {
          setProfile(res.data);
          setIsPrivate(res.data.is_private);
        })
        .catch((err) => console.error("Failed to fetch profile:", err));
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      axios
        .get("http://localhost:3000/api/v1/posts", { withCredentials: true })
        .then((res) => {
          const userPosts = res.data.filter((post) => post.user_id == userId);
          setPosts(userPosts);
        })
        .catch((err) => console.error("Failed to fetch posts:", err));
    }
  }, [userId]);

  const handleDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      axios
        .delete(`http://localhost:3000/api/v1/posts/${postId}`, {
          withCredentials: true,
        })
        .then(() => {
          setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        })
        .catch((err) => console.error("Failed to delete post:", err));
    }
  };

  const handleSavePrivacy = () => {
    axios
      .put(
        "http://localhost:3000/api/v1/user/private",
        { is_private: isPrivate },
        { withCredentials: true }
      )
      .then(() => {
        setProfile((prev) => ({ ...prev, is_private: isPrivate }));
        setShowModal(false);
      })
      .catch((err) => console.error("Failed to update privacy:", err));
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

        <div className="d-flex justify-content-end mt-2">
          <button
            className="btn btn-outline-light btn-sm rounded-pill px-3"
            onClick={() => setShowModal(true)}
          >
            Edit profile
          </button>
        </div>

        <h4 className="mt-2 mb-0">
          {profile.full_name}
          <span className="badge bg-black border-white border ms-4 rounded-4">
            Get verified
          </span>
        </h4>

        <div className="text-white opacity-50 mb-2">@{profile.username}</div>

        <div className="text-white mt-1 d-flex opacity-50">
          <Calendar className="me-2" />
          Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : ""}
        </div>
        <Follow />
      </div>

      <ProfileAct />

      <div className="container mt-4">
        <h5>Your Posts</h5>
        {posts.length === 0 ? (
          <p className="text-white-50">No posts found.</p>
        ) : (
          posts.map((post) => (
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
              <button
                onClick={() => handleDelete(post.id)}
                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
              >
                <Trash2 size={16} className="me-1" /> Delete
              </button>
            </div>
          ))
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Private</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Check
            type="switch"
            label="Private Account"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSavePrivacy}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TwitterProfile;