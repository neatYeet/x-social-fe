import { Search, Settings } from "lucide-react";

export default function SearchComponent() {
  return (
    <div className="post-container d-flex align-items-center postcard ms-5">
      <div className="input-group text-white d-flex justify-content-between ms-2">
        <button
          type="text"
          className="form-control bg-black border-dark text-white text-start rounded-4 me-5"
        ><Search size={15} className="me-2"/>Search</button>
        <Settings/>
      </div>
    </div>
  );
}
