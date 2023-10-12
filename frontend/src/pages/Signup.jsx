import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, Navigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const { user, dispatch } = useAuthContext();

  const handleImageChange = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = { username, email, password, imageUrl };
    // send a post req of signup
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/api/users/signup",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();
    console.log(json);

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

  if (user) return <Navigate to="/" replace={true} />;
  return (
    <div className="w-screen h-screen bg-primary-color text-third-color flex justify-center items-center font-poppins">
      <div className="w-3/5 sm:max-w-[25rem] p-5 bg-slate-800 rounded-2xl flex flex-col justify-center items-center">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-sm font-medium">Please enter your details</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:p-5 m-2 justify-between w-full text-primary-color"
        >
          <div className="flex flex-col justify-center items-center">
            <img
              src={
                imageUrl ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
              }
              alt=""
              className="w-[100px] h-[100px] mb-2 object-cover object-top rounded-full"
            />
            <label
              htmlFor="imageInput"
              className="w-full flex justify-center items-center mb-5"
            >
              <div className="w-2/3 p-2 rounded-full text-white bg-black flex items-center justify-center text-sm cursor-pointer">
                Change picture
              </div>
            </label>
            <input
              id="imageInput"
              name="imageInput"
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <div className="flex flex-col mb-3">
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Enter your username"
              autoComplete="off"
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              className="rounded-2xl h-7 p-2 px-5 text-sm shadow-md outline-none"
            />
          </div>
          <div className="flex flex-col mb-3">
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Enter your email"
              autoComplete="off"
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="rounded-2xl h-7 p-2 px-5 text-sm shadow-md outline-none "
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

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-2xl p-2 mt-4 text-sm "
          >
            {loading ? "Signing up..." : "Sign up"}
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
          Already have an account?
          <span>
            <Link to={"/login"}> Sign in</Link>
          </span>
        </p>
      </div>
    </div>
  );
};
export default Signup;
