import { Camera } from "lucide-react";
import { useState } from "react";
import api from "../utils/api";
import Swal from "sweetalert2";

export default function CreatePost() {
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
    if (file) formData.append("file", file); // sesuai backend

    try {
      await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="post-container d-flex flex-column mt-3 postcard">
      <div className="border border-dark rounded p-3 w-auto postcard">
        <form onSubmit={handleUpload}>
          <div className="d-flex mb-3 align-items-center">
            <div
              className="rounded-circle bg-white d-flex justify-content-center align-items-center me-2"
              style={{ width: "40px", height: "40px", fontWeight: "bold" }}
            >
            </div>
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

          <div className="d-flex justify-content-between create-action align-items-center">
            <label className="btn text-primary w-50 m-0">
              <Camera size={20} className="me-3" />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>

            <button
              type="submit"
              className="btn bg-white opacity-50 fw-bold text-black rounded-5"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
