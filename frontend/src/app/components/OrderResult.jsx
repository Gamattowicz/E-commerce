import React from "react";

export default function OrderResult({ totalPrice, paymentTerm }) {
  const dateObj = new Date(paymentTerm);
  const formattedDate = dateObj.toLocaleDateString();

  return (
    <React.Fragment>
      <div className="bg-neutral p-8 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">
          Your order has been placed
        </h2>

        <div className="p-2">
          <span>
            The total price of the products is{" "}
            <p className="font-bold">{totalPrice}zł</p>
          </span>
        </div>
        <div className="p-2">
          <span>
            The payment term is <p className="font-bold">{formattedDate}</p>
          </span>
        </div>
      </div>
    </React.Fragment>
  );
}
