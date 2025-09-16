import React from "react";

const OrderHistory = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Order History</h2>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Order #12345</h3>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              Delivered
            </span>
          </div>
          <p className="text-sm text-gray-600">September 10, 2025 • $45.50</p>
          <p className="text-sm text-gray-500 mt-2">
            Coca-Cola (12 bottles), Pepsi (6 bottles), Sprite (6 bottles)
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Order #12344</h3>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              In Transit
            </span>
          </div>
          <p className="text-sm text-gray-600">September 9, 2025 • $32.25</p>
          <p className="text-sm text-gray-500 mt-2">
            Mountain Dew (8 bottles), Orange Crush (4 bottles)
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
