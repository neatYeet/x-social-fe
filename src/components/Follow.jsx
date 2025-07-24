import { useEffect, useState } from "react";
import api from "../utils/api";
import { Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function Follow() {
  const { username } = useParams();
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [modalUsers, setModalUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  // Fetch jumlah followers & following
  const fetchFollowCounts = async () => {
    try {
      const res = await api.get(
        `/users/${username}/follow-count`
      );
      setFollowersCount(res.data.followersCount ?? 0);
      setFollowingCount(res.data.followingCount ?? 0);
    } catch (err) {
      console.error("Error fetching follow count:", err);
    }
  };

  // Fetch data followers/following saat buka modal
  const openModal = async (title) => {
    setModalTitle(title);
    setShowModal(true);

    try {
      const res = await api.get(
        `/users/${username}/follow-count`
      );
      const list =
        title === "Followers" ? res.data.followers : res.data.following;
      setModalUsers(list || []);
    } catch (err) {
      console.error(`Error fetching ${title.toLowerCase()}:`, err);
      setModalUsers([]);
    }
  };

  useEffect(() => {
    if (username) fetchFollowCounts();
  }, [username]);

  // Handle Accept Request
  const handleAccept = async (targetUsername) => {
    try {
      await api.put(
        `/users/follow/accept/${targetUsername}`,
        {}
      );

      const res = await api.get(
        `/users/${username}/follow-count`
      );
      const updatedList =
        modalTitle === "Followers" ? res.data.followers : res.data.following;
      setModalUsers(updatedList);
    } catch (err) {
      console.error("Failed to accept follow request", err);
    }
  };

  return (
    <>
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
                {modalTitle === "Followers" && user.status === "requested" ? (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleAccept(user.username)}
                  >
                    Accept
                  </Button>
                ) : (
                  <span className="badge bg-secondary">
                    {user.status === "following"
                      ? "Following"
                      : user.status === "requested"
                        ? "Requested"
                        : "Unknown"}
                  </span>
                )}
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
    </>
  );
}