import { logoutUser } from "../actions/logoutUser";

const AdminPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-16 py-24">
      <div className="border border-zinc-800 rounded-xl bg-zinc-900 p-8">
        <h1 className="text-4xl font-bold">
          Admin <span className="text-[#E14747]">Dashboard</span>
        </h1>

        <p className="mt-2 text-gray-300">
          Welcome to the KiloBoy admin portal.
        </p>

        <form action={logoutUser} className="mt-10">
          <button
            type="submit"
            className="
              rounded-lg
              bg-[#E14747]
              px-5
              py-3
              font-medium
              text-white
              transition
              hover:opacity-90
            "
          >
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;