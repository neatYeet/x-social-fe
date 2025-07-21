import ForYou from "../components/ForYou";
import Sidebar from "../components/Sidebar";
import Suggest from "../components/Suggest";

export default function Explore() {
  return (
    <div className="d-flex flex-column container w-50 home-container">
      {/* <Sidebar /> */}
      <ForYou />
      {/* <Suggest /> */}
    </div>
  );
}
