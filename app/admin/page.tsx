import { logoutUser } from "../actions/logoutUser";

const AdminPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-kilored">Dashboard</h1>
      <form action={logoutUser}>
        <button
          type="submit"
          className="mt-4 rounded-lg bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600"
        >
          Log out
        </button>
      </form>
    </div>
  );
};

export default AdminPage;
