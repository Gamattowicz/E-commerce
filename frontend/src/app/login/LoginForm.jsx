"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../userContext";
import Message from "../components/Message";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isClient, setIsClient] = useState(false);
  const { userInfo, setUserInfo } = useUser();
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch("http://127.0.0.1:8000/users/login/", {
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
    if (userInfo) {
      router.push("/products");
    }
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
          className="bg-neutral p-8 rounded-lg shadow-md w-96"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">LOGIN</h2>
          {error && <Message variant="error">{error}</Message>}

          <div className="mb-2">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter Username"
              className="input input-bordered input-primary w-full max-w-xs"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              className="input input-bordered input-primary w-full max-w-xs"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button type="submit" className="btn btn-primary w-full p-1">
              Login
            </button>
            <label className="label mt-2">
              <span className="label-text-alt"></span>
              <span className="label-text-alt">
                New Customer?{" "}
                <Link href="/sign-up" className="text-primary cursor-pointer">
                  Sign up!
                </Link>
              </span>
            </label>
          </div>
        </form>
      )}
    </React.Fragment>
  );
}
