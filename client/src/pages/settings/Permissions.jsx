import React from "react";

const Permissions = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">User Permissions</h2>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Staff Permissions</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600"
                defaultChecked
              />
              <span className="text-sm">Manage Inventory</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600"
                defaultChecked
              />
              <span className="text-sm">Process Orders</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4 text-blue-600" />
              <span className="text-sm">View Reports</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Manage Customers</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
