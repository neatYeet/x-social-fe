import Sidebar from "../components/Sidebar";
import Suggest from "../components/Suggest";
import TwitterProfile from "../components/User";
import UserProfile from "../components/UserProfile";

export default function Users() {
  return (
    <div className="d-flex flex-column container w-50 home-container">
      <Sidebar />
      <UserProfile />
      <Suggest />
    </div>
  );
}
