"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Product from "../components/Product";
import Pagination from "../components/Pagination";
import { useUser } from "../userContext";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const { userInfo, setUserInfo } = useUser();
  const [productNumbers, setProductNumbers] = useState(0);
  const [page, setPage] = useState(1);
  const [productOnPage, setProductOnPage] = useState(3);
  const [sortOrder, setSortOrder] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
  });

  const router = useRouter();
  async function fetchProduct() {
    try {
      let endpoint = `http://127.0.0.1:8000/products/?page=${page}&page_size=${productOnPage}`;
      if (sortOrder) {
        endpoint += `&ordering=${sortOrder}`;
      }
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          endpoint += `&${key}=${value}`;
        }
      });
      const res = await fetch(endpoint);
      const data = await res.json();
      setProducts(data.results);
      setProductNumbers(data.count);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  const refreshProducts = async () => {
    fetchProduct();
  };

  const handleAddProductBtn = async (e) => {
    e.preventDefault();
    router.push("/products/create/");
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    fetchProduct();
  }, [page, sortOrder, filters]);

  return (
    <React.Fragment>
      {userInfo && userInfo.user_type === 2 && (
        <div className="flex justify-center items-center mb-4">
          <button
            type="submit"
            className="btn btn-lg btn-primary w-1/4 p-1 m-2"
            onClick={handleAddProductBtn}
          >
            Add product
          </button>
        </div>
      )}

      <div className="flex justify-center items-center mb-4 flex-wrap">
        <select
          className="select select-primary w-full max-w-xs m-2"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option disabled selected value="">
            Sort by...
          </option>
          <option value="name">Name</option>
          <option value="category">Category</option>
          <option value="price">Price</option>
        </select>
        <input
          type="text"
          placeholder="Filter by name"
          className="m-2"
          value={filters.name}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Filter by category"
          className="m-2"
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Filter by description"
          className="m-2"
          value={filters.description}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Filter by price"
          className="m-2"
          value={filters.price}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, price: e.target.value }))
          }
        />
      </div>
      <div className="flex flex-wrap justify-between items-center">
        {products.length <= 0 && (
          <div>
            <p className="font-bold text-center text-primary text-2xl">
              No product
            </p>
          </div>
        )}
        {products.map((product) => (
          <Product
            key={product.id}
            product={product}
            onProductDelete={refreshProducts}
          />
        ))}
      </div>
      <div className="flex justify-center items-center mb-4">
        <Pagination
          pageNumbers={Math.ceil(productNumbers / productOnPage)}
          handlePageChange={handlePageChange}
          currentPage={page}
        />
      </div>
    </React.Fragment>
  );
}
