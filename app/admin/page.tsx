import { logoutUser } from "../actions/logoutUser";

const AdminPage = () => {
  return (
    <div>
      <h1>I am the admin main page</h1>
       <button
        className="bg-gray-400 p-2 rounded-lg"
        onClick={logoutUser}
       >Logout</button>

    </div>
  )
};

export default AdminPage;
