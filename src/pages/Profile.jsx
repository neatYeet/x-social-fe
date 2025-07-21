import Sidebar from "../components/Sidebar";
import Suggest from "../components/Suggest";
import TwitterProfile from "../components/User";

export default function Profile() {
  return (
    <div className="d-flex flex-column container w-50 home-container">
      <Sidebar />
      <TwitterProfile />
      <Suggest />
    </div>
  );
}
