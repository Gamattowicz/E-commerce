import React from "react";

export default function TopProduct({ product }) {
  return (
    <div className="bg-neutral p-6 rounded-lg shadow-md m-2">
      <div className="flex justify-between">
        <div className="p-1 font-bold text-center flex items-center justify-center w-1/2">
          {product.product__name}
        </div>
        <div className="p-1 italic text-center flex items-center justify-center w-1/2">
          Orders: {product.total_ordered}
        </div>
      </div>
    </div>
  );
}
