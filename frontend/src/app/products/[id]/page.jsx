import React from "react";
import ProductDetail from "./ProductDetail";

export default function page({ params }) {
  const productId = params.id;
  return <ProductDetail productId={productId} />;
}
