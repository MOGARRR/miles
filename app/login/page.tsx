import { loginUser } from "../actions/loginUsers";

const LoginPage = () => {
  return (
    <div >
      <form className="flec flex-col" action={loginUser}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
