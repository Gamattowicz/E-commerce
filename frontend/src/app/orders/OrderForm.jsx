"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../userContext";
import OrderResult from "../components/OrderResult";

export default function OrderForm() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [orderItems, setOrderItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const { userInfo, setUserInfo } = useUser();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [totalPrice, setTotalPrice] = useState("");
  const [paymentTerm, setPaymentTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddProduct = () => {
    if (product && quantity > 0) {
      setOrderItems([...orderItems, { product, quantity }]);
      setProduct("");
      setQuantity(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const orderData = {
      customer_name: customerName,
      delivery_address: {
        street,
        city,
        postal_code: postalCode,
        country,
      },
      order_items: orderItems,
    };

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const res = await fetch("http://127.0.0.1:8000/orders/", {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.access}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail);
      }
      const data = await res.json();
      setTotalPrice(data.total_price);
      setPaymentTerm(data.payment_due_date);
      setOrderPlaced(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  async function fetchProducts() {
    try {
      const res = await fetch("http://127.0.0.1:8000/products/");
      const data = await res.json();
      if (data && Array.isArray(data.results)) {
        setProducts(data.results);
      } else {
        console.error(
          "Received data does not have a valid 'results' array:",
          data
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    if (userInfo && userInfo.user_type !== 1) {
      router.push("/products");
    } else {
      fetchProducts();
    }
  }, [router, userInfo]);
  return (
    <React.Fragment>
      {isLoading ? (
        <>
          <span className="loading loading-ball loading-xs text-primary"></span>
          <span className="loading loading-ball loading-sm text-primary"></span>
          <span className="loading loading-ball loading-md text-primary"></span>
          <span className="loading loading-ball loading-lg text-primary"></span>
        </>
      ) : orderPlaced ? (
        <OrderResult totalPrice={totalPrice} paymentTerm={paymentTerm} />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-neutral p-8 rounded-lg shadow-md w-96"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Create Order</h2>

          <div className="mb-2">
            <label className="label">
              <span className="label-text">Name and surname</span>
            </label>
            <div className="relative">
              <input
                id="question"
                type="text"
                placeholder="Enter your name"
                className="input input-bordered input-primary w-full max-w-xs"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="label">
              <span className="label-text">Street</span>
            </label>
            <div className="relative">
              <input
                id="street"
                type="text"
                placeholder="Enter street"
                className="input input-bordered input-primary w-full max-w-xs"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="label">
              <span className="label-text">City</span>
            </label>
            <div className="relative">
              <input
                id="city"
                type="text"
                placeholder="Enter city"
                className="input input-bordered input-primary w-full max-w-xs"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="label">
              <span className="label-text">Postal code</span>
            </label>
            <div className="relative">
              <input
                id="postal_code"
                type="text"
                placeholder="Enter postal code"
                className="input input-bordered input-primary w-full max-w-xs"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="label">
              <span className="label-text">Country</span>
            </label>
            <div className="relative">
              <input
                id="country"
                type="text"
                placeholder="Enter country"
                className="input input-bordered input-primary w-full max-w-xs"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>
          <div
            className="tooltip tooltip-warning tooltip-open tooltip-right"
            data-tip="Remember to add all products to your cart by clicking ADD PRODUCT button before you use CREATE ORDER button. You have to add each product separately"
          >
            <div className="mb-2">
              <label className="label">
                <span className="label-text">Product</span>
              </label>
              <div className="relative">
                <select
                  className="select select-primary w-full max-w-xs"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                >
                  <option disabled selected value="">
                    Select Product
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-2">
              <label className="label">
                <span className="label-text">Quantity</span>
              </label>
              <div className="relative">
                <input
                  id="quantity"
                  type="number"
                  placeholder="Select amount of product"
                  className="input input-bordered input-primary w-full max-w-xs"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  not
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="btn btn-warning p-1"
                onClick={handleAddProduct}
              >
                Add product
              </button>
            </div>
          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary w-full p-1">
              Create order
            </button>
          </div>
        </form>
      )}
    </React.Fragment>
  );
}
