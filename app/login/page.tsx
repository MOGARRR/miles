import { loginUser } from "../actions/loginUsers";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2">
          KiloBoy Artwork
        </h1>

        <p className="text-center text-gray-300 mb-8">
          Admin Portal
        </p>

        <form
          action={loginUser}
          className="flex flex-col gap-4 bg-zinc-900 p-8 rounded-xl border border-zinc-800"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="
              bg-zinc-800
              border border-zinc-700
              rounded-lg
              px-4 py-3
              text-white
              placeholder:text-gray-400
              focus:outline-none
              focus:border-[#E14747]
            "
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="
              bg-zinc-800
              border border-zinc-700
              rounded-lg
              px-4 py-3
              text-white
              placeholder:text-gray-400
              focus:outline-none
              focus:border-[#E14747]
            "
          />

          <button
            type="submit"
            className="
              mt-2
              bg-[#E14747]
              text-white
              font-semibold
              py-3
              rounded-lg
              transition
              hover:opacity-90
            "
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;