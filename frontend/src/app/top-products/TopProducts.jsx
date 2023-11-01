"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopProduct from "../components/TopProduct";
import { useUser } from "../userContext";

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2023-10-31");
  const [productCount, setProductCount] = useState(3);
  const [isClient, setIsClient] = useState(false);
  const { userInfo, setUserInfo } = useUser();
  const [dataLoaded, setDataLoaded] = useState(false);

  const router = useRouter();

  async function fetchTopProduct() {
    try {
      let endpoint = `http://127.0.0.1:8000/products/top/`;
      if (endDate && startDate) {
        endpoint += `?date_from=${startDate}&date_to=${endDate}`;
      }
      if (productCount) {
        endpoint += `&product_count=${productCount}`;
      }
      const res = await fetch(endpoint);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    setIsClient(true);
    setDataLoaded(true);
    fetchTopProduct();
  }, [isClient]);

  useEffect(() => {
    if (dataLoaded && userInfo) {
      if (userInfo.user_type === null || userInfo.user_type !== 2) {
        router.push("/products");
      } else {
        fetchTopProduct();
      }
    }
  }, [userInfo, dataLoaded, router]);
  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-4xl font-bold mb-4 text-center">Top products</h2>

      <div className="flex flex-row space-x-4 mb-4 items-center">
        <div>
          <label className="mr-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label className="mr-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label className="mr-2">Product Count:</label>
          <input
            type="number"
            value={productCount}
            onChange={(e) => setProductCount(e.target.value)}
            min="1"
            className="border p-1 rounded"
          />
        </div>

        <button
          onClick={fetchTopProduct}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </div>
      <div className="flex flex-wrap justify-between items-center">
        {products.length <= 0 && (
          <div>
            <p className="font-bold text-center text-primary text-2xl">
              No products
            </p>
          </div>
        )}
        {products.map((product) => (
          <TopProduct key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
