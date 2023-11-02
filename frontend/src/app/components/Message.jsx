import React from "react";

export default function Message({ variant, children }) {
  return (
    <div className="flex justify-center">
      <div
        className={`alert alert-${variant} mb-4 mx-2 w-1/2 flex items-center justify-center`}
      >
        <span className="font-bold text-lg">{children}</span>
      </div>
    </div>
  );
}
