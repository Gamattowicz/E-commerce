"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "../../../userContext";

export default function ProductUpdate() {
  const searchParams = useParams();
  const productId = searchParams.id;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { userInfo, setUserInfo } = useUser();

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      let method = "PATCH";
      if (newImage) {
        formData.append("image", newImage);
        method = "PUT";
      }
      for (let pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const res = await fetch(`http://127.0.0.1:8000/products/${productId}/`, {
        method: method,
        body: formData,
        headers: {
          Authorization: `Bearer ${userInfo.access}`,
        },
      });
      console.log(res);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail);
      }
      const data = await res.json();
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    router.push("/products");
  };

  useEffect(() => {
    setIsClient(true);
    setDataLoaded(true);
  }, [isClient, router]);

  useEffect(() => {
    if (dataLoaded) {
      if (userInfo && userInfo.user_type !== 2) {
        router.push("/products");
      } else {
        async function fetchData() {
          try {
            const res = await fetch(
              `http://127.0.0.1:8000/products/${productId}/`
            );
            const product = await res.json();

            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setCategory(product.category);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        }
        fetchData();
      }
    }
  }, [dataLoaded, router, productId, userInfo]);
  return (
    <React.Fragment>
      <form
        onSubmit={handleSubmit}
        className="bg-neutral p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Update Product</h2>

        <div className="mb-2">
          <label className="label">
            <span className="label-text">Product name</span>
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              placeholder="Enter product name"
              className="input input-bordered input-primary w-full max-w-xs"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              className="textarea textarea-primary w-full max-w-xs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-2">
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
              className="input input-bordered input-primary w-full max-w-xs"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="label">
            <span className="label-text">Product category</span>
          </label>
          <div className="relative">
            <input
              id="category"
              type="text"
              placeholder="Enter product category"
              className="input input-bordered input-primary w-full max-w-xs"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="label">
            <span className="label-text">Product image</span>
          </label>
          <div className="relative">
            <input
              id="image"
              type="file"
              placeholder="Enter product image"
              className="file-input file-input-bordered file-input-primary w-full max-w-xs"
              onChange={(e) => setNewImage(e.target.files[0])}
            />
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-primary w-full p-1">
            Update product
          </button>
        </div>
      </form>
    </React.Fragment>
  );
}
