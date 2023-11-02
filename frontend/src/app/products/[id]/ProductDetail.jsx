"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProductDetail({ productId }) {
  const [product, setProduct] = useState("");
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    async function fetchData() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/products/${productId}/`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchData();
  }, [productId, router, isClient]);
  return (
    <div className="card w-1/2 bg-neutral rounded-lg shadow-xl">
      <figure className="mt-4">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          sizes="50vw, 33vw"
          style={{ height: "auto", width: "auto", maxHeight: "33vh" }}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <p>{product.description}</p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline badge-accent">
            {product.price}zł
          </div>
          <div className="badge badge-outline badge-info">
            {product.category}
          </div>
        </div>
      </div>
    </div>
  );
}
