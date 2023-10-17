import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { ArrowLeft, Edit, X } from "lucide-react";
import { useOpenSettingsContext } from "../../hooks/useOpenSettingsModalContext";
import { useOpenProfileContext } from "../../hooks/useOpenProfileContext";
import { redirect } from "react-router-dom";

const Profile = () => {
  const { user, dispatch } = useAuthContext();
  const { handleCancel } = useOpenSettingsContext();
  const { setOpenProfile } = useOpenProfileContext();

  const [username, setUsername] = useState(user?.newUser?.username);
  const [email, setEmail] = useState(user?.newUser?.email);
  const [imageUrl, setImageUrl] = useState(user?.newUser?.imageUrl);

  const [loading, setLoading] = useState(false);

  const [usernameIsEditable, setUsernameIsEditable] = useState(false);
  const [emailIsEditable, setEmailIsEditable] = useState(false);

  const handleImageChange = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    if (file) reader.readAsDataURL(file);
  };

  const goBack = () => {
    setOpenProfile(false);
  };

  const handleSave = async () => {
    setLoading(true);

    const body = {
      username,
      email,
      profilePic: imageUrl,
    };

    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + `/api/users/updateUserInfo`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    if (response.status === 200) {
      const userDetails = JSON.parse(localStorage.getItem("user"));
      const userAndToken = { ...userDetails };
      userAndToken.newUser = json;
      console.log({ userAndToken });

      dispatch({ type: "LOGIN", payload: userAndToken });
      localStorage.setItem("user", JSON.stringify(userAndToken));

      handleCancel();
    } else {
      alert("Your token has been expired, login again");
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
      return redirect("/login");
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div
        onClick={goBack}
        className="cursor-pointer absolute top-1 left-1 rounded"
      >
        <ArrowLeft />
      </div>
      <div
        onClick={handleCancel}
        className="cursor-pointer absolute top-1 right-1 rounded"
      >
        <X />
      </div>
      <div>
        <label
          htmlFor="imageInput"
          className="w-full flex justify-center items-center m-1"
        >
          <img
            src={
              imageUrl ||
              user.newUser.profilePic ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
            }
            alt=""
            className="w-[100px] h-[100px] mb-2 object-cover object-center rounded-full cursor-pointer"
          />
        </label>
        <input
          id="imageInput"
          name="imageInput"
          type="file"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      <div className="w-full m-1 p-2 rounded text-black bg-white flex items-center justify-between text-sm cursor-pointer">
        {usernameIsEditable ? (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="p-1 px-2 rounded border-green-500 border-b-4 outline-none bg-slate-200"
            />
          </>
        ) : (
          <>
            <h1>{username}</h1>
            <Edit
              onClick={() => {
                setUsernameIsEditable(true);
              }}
            />
          </>
        )}
      </div>
      <div className="w-full m-1 p-2 rounded text-black bg-white flex items-center justify-between text-sm cursor-pointer">
        {emailIsEditable ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="p-1 px-2 rounded border-green-500 border-b-4 outline-none bg-slate-200"
            />
          </>
        ) : (
          <>
            <h1>{email}</h1>
            <Edit
              onClick={() => {
                setEmailIsEditable(true);
              }}
            />
          </>
        )}
      </div>
      <div
        onClick={handleSave}
        className="w-2/3 mt-5 p-2 rounded-full text-white bg-black flex items-center justify-center text-sm cursor-pointer"
      >
        {loading ? "Saving..." : "Save"}
      </div>
    </div>
  );
};

export default Profile;
