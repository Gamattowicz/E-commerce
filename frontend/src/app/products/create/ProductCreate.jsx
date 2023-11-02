"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../userContext";
import Message from "../../components/Message";

export default function ProductCreate() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const { userInfo, setUserInfo } = useUser();
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !category || !image) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("image", image);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const res = await fetch("http://127.0.0.1:8000/products/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData);
        throw new Error(errorData.detail);
      }
      const data = await res.json();
      router.push("/products");
    } catch (error) {
      setError(error.message);
      console.error("Error fetching products:", error.message);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.user_type !== 2) {
      router.push("/products");
    }
  }, [router, userInfo]);
  return (
    <React.Fragment>
      {error && <Message variant="error">{error}</Message>}
      <form
        onSubmit={handleSubmit}
        className="bg-neutral p-8 rounded-lg shadow-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Create Product</h2>

        <div className="flex justify-between mb-2">
          <div className="w-1/2 pr-2">
            <label className="label">
              <span className="label-text">Product name</span>
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                placeholder="Enter product name"
                className="input input-bordered input-primary w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="w-1/2 pl-2">
            <label className="label">
              <span className="label-text">Product image</span>
            </label>
            <div className="relative">
              <input
                id="image"
                type="file"
                placeholder="Enter product image"
                className="file-input file-input-bordered file-input-primary w-full"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mb-2">
          <div className="w-1/2 pr-2">
            <label className="label">
              <span className="label-text">Product price</span>
            </label>
            <div className="relative">
              <input
                id="price"
                type="number"
                step="0.01"
                min="1"
                placeholder="Enter product price"
                className="input input-bordered input-primary w-full"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="w-1/2 pl-2">
            <label className="label">
              <span className="label-text">Product category</span>
            </label>
            <div className="relative">
              <input
                id="category"
                type="text"
                placeholder="Enter product category"
                className="input input-bordered input-primary w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mb-2">
          <label className="label">
            <span className="label-text">Product description</span>
          </label>
          <div className="relative">
            <textarea
              id="description"
              type="text"
              placeholder="Enter product description"
              className="textarea textarea-primary w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button type="submit" className="btn btn-primary w-1/4 p-1">
            Create product
          </button>
        </div>
      </form>
    </React.Fragment>
  );
}
