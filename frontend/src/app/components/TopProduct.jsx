import Link from "next/link";
import React from "react";

export default function TopProduct({ product }) {
  return (
    <div className="bg-neutral p-6 rounded-lg shadow-md m-2">
      <div className="flex justify-between">
        <div className="p-1 font-bold text-center  flex items-center justify-center w-1/2">
          <Link
            href={`/products/${product.product_id}/`}
            className="link link-hover link-primary text-shadow-lg"
          >
            {product.product__name}
          </Link>
        </div>
        <div className="p-1 italic text-center flex items-center justify-center w-1/2">
          Orders: {product.total_ordered}
        </div>
      </div>
    </div>
  );
}
