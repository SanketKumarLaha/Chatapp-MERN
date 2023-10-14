import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const { dispatch } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const body = { email, password };

    // send a post req of login
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/api/users/login",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();

    // dispatch a action in the context
    if (response.ok) {
      dispatch({ type: "LOGIN", payload: json });
      localStorage.setItem("user", JSON.stringify(json));
      setEmail("");
      setPassword("");
    }
    if (!response.ok) {
      setError(json.error);
    }
    setLoading(false);
  };

  const { user } = useAuthContext();

  if (user) return <Navigate to="/" replace={true} />;

  return (
    <div className="w-[100svw] h-[100svh] bg-primary-color text-third-color flex justify-center items-center font-poppins">
      <div className="w-4/5 max-w-[23rem] sm:max-w-[25rem] sm:w-1/2 p-7 bg-slate-800 rounded-2xl flex flex-col justify-center items-center ">
        <div className="mb-5 flex flex-col items-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-sm font-medium">Please enter your details</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:p-5 m-2 justify-between w-full text-primary-color"
        >
          <div className="flex flex-col mb-3">
            <input
              type="text"
              id="email"
              value={email}
              placeholder="Enter your email"
              autoComplete="off"
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="rounded-2xl h-7 p-2 px-5 text-sm shadow-md outline-none"
            />
          </div>
          <div className="flex flex-col mb-3">
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Enter your password"
              autoComplete="off"
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="rounded-2xl h-7 p-2 px-5 text-sm shadow-md outline-none"
            />
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-2xl p-2 mt-4 text-sm ">
            {loading ? "Signing in..." : "Sign in"}
          </button>
          {error && (
            <div className="my-1 border rounded border-red-600">
              <p className="text-md font-sans text-red-500 text p-1 px-2">
                {error}
              </p>
            </div>
          )}
        </form>
        <p className="text-sm font-medium text-third-color">
          Don't have an account?
          <span>
            <Link to={"/signup"}> Sign up</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
