"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../userContext";
import Message from "../components/Message";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("1");
  const [isClient, setIsClient] = useState(false);
  const { userInfo, setUserInfo } = useUser();
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("user_type", userType);

        const res = await fetch("http://127.0.0.1:8000/users/register/", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail);
        }
        const data = await res.json();
        setUserInfo(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
      } catch (error) {
        setError(error.message);
        console.error("Error fetching products:", error.message);
      }
    } else {
      setError("Password and confirm password are not the same");
    }
    if (userInfo) {
      router.push("/products");
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  useEffect(() => {
    setIsClient(true);
    if (userInfo) {
      router.push("/products");
    }
  }, [router, userInfo]);
  return (
    <React.Fragment>
      {isClient && (
        <form
          onSubmit={handleSubmit}
          className="bg-neutral p-8 rounded-lg shadow-md w-full"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">SIGN UP</h2>
          {error && <Message variant="error">{error}</Message>}

          <div className="flex mb-2">
            <div className="flex-1 mr-2">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter Username"
                className="input input-bordered input-primary w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter Email"
                className="input input-bordered input-primary w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex mb-2">
            <div className="flex-1 mr-2">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                className="input input-bordered input-primary w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className="input input-bordered input-primary w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="relative justify-center mb-2 flex">
              <label className="label">
                <span className="label-text">Select account type</span>
              </label>
            </div>

            <div className="relative flex mb-2">
              <div className="form-control w-1/2 flex items-center mr-2">
                <label className="label cursor-pointer">
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio checked:bg-primary mr-2"
                    onChange={() => handleUserTypeChange("1")}
                    defaultChecked
                  />
                  <span className="label-text text-sm">Client</span>
                </label>
              </div>
              <div className="form-control w-1/2 flex items-center">
                <label className="label cursor-pointer">
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio checked:bg-error mr-2"
                    onChange={() => handleUserTypeChange("2")}
                  />
                  <span className="label-text text-sm">Seller</span>
                </label>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-4 flex justify-center">
              <button type="submit" className="btn btn-primary w-1/2 p-1">
                Register
              </button>
            </div>
            <label className="label mt-2">
              <span className="label-text-alt"></span>
              <span className="label-text-alt">
                Have an account?{" "}
                <Link href="/login" className="text-primary cursor-pointer">
                  Login
                </Link>
              </span>
            </label>
          </div>
        </form>
      )}
    </React.Fragment>
  );
}
