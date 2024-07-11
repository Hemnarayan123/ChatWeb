import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import chatApp from '../../src/assets/chatApp.jpeg'

function Signup() {
  const [authUser, setAuthUser] = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", file);

    await axios.post("/api/user/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data) {
          toast.success("Signup successful");
        }
        localStorage.setItem("ChatApp", JSON.stringify(response.data));
        setAuthUser(response.data);
      })
      .catch((error) => {
        if (error.response) {
          toast.error("Error: " + error.response.data.error);
        }
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div
      className="flex h-screen items-center justify-center" 
      style={{
        backgroundImage: `url(${chatApp})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-white px-6 py-2 rounded-md space-y-3 w-96 bg-blur-lg " 
      >
        <h1 className="text-2xl text-center">
          Chat<span className="text-green-500 font-semibold">App</span>
        </h1>
        {/* <h2 className="text-xl text-white font-bold">Signup</h2> */}
        <br />

        {/* Image upload */}
        <input
          type="file"
          id="profileImage"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="profileImage"
          className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <svg
              className="w-12 h-12 text-gray-500"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              <path d="M19 8h-2v3h-2v-3h-3v-2h3v-3h2v3h3v2z" fill="green" style={{ paddingLeft: '5px' }} />
            </svg>
          )}
        </label>

        {/* Fullname */}
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Fullname"
            {...register("fullname", { required: true })}
          />
        </label>
        {errors.fullname && (
          <span className="text-red-500 text-sm font-semibold">
            This field is required
          </span>
        )}
        {/* Email */}
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="email"
            className="grow"
            placeholder="Email"
            {...register("email", { required: true })}
          />
        </label>
        {errors.email && (
          <span className="text-red-500 text-sm font-semibold">
            This field is required
          </span>
        )}

        {/* Password */}
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="password"
            className="grow"
            placeholder="Password"
            {...register("password", { required: true })}
          />
        </label>
        {errors.password && (
          <span className="text-red-500 text-sm font-semibold">
            This field is required
          </span>
        )}
        {/* Text & Button */}
        <div className="flex flex-col justify-between">
          <input
            type="submit"
            value="Signup"
            className="text-white bg-green-500 px-2 py-1 cursor-pointer rounded-lg mt-3.5 mb-2"
          />
          <p>
            Have an account?
            <Link
              to="/login"
              className="text-blue-500 underline cursor-pointer ml-1"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signup;
