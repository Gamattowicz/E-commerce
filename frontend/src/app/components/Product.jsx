/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Link from "next/link";
import Image from "next/image";

import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useUser } from "../userContext";

export default function Product({ product, onProductDelete }) {
  const { userInfo, setUserInfo } = useUser();

  const deleteHandler = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const res = await fetch(`http://127.0.0.1:8000/products/${product.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      onProductDelete();
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  return (
    <React.Fragment>
      <div className="bg-neutral p-6 rounded-lg shadow-md w-1/4 m-2">
        <div className="flex justify-between">
          <div className="p-1 font-bold text-center  flex items-center justify-center w-1/2">
            <Link
              href={`/products/${product.id}/`}
              className="link link-hover link-primary text-shadow-lg"
            >
              {product.name}
            </Link>
          </div>
          <div>
            <Image
              src={product.thumbnail}
              alt={product.name}
              width={200}
              height={200}
            />
          </div>
          {userInfo && userInfo.user_type === 2 && (
            <div className="ml-4 p-4 text-center  flex items-center justify-center w-1/2">
              <Link
                href={`/products/${product.id}/update/`}
                className="link link-hover link-primary text-shadow-lg"
              >
                <FiEdit className="icons" />
              </Link>{" "}
              <div className="p-2">
                <RiDeleteBin6Line
                  className="icons link link-hover link-primary text-shadow-lg"
                  onClick={() =>
                    document
                      .getElementById(`delete_modal_${product.id}`)
                      .showModal()
                  }
                />
              </div>
              <dialog
                id={`delete_modal_${product.id}`}
                className="modal modal-bottom sm:modal-middle"
              >
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Delete product</h3>
                  <p className="py-4">
                    {" "}
                    Are you sure you want to remove product "{product.name}
                    "?
                  </p>
                  <div className="flex justify-between w-full">
                    <button
                      className="btn btn-outline btn-error p-4"
                      onClick={deleteHandler}
                    >
                      Yes
                    </button>
                    <form method="dialog">
                      <button className="btn btn-outline btn-accent p-4">
                        No
                      </button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
