import React from "react";

const Preferences = ({ userRole }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Preferences</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Display Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Dark Mode</span>
              <input type="checkbox" className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Compact View</span>
              <input type="checkbox" className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>

        {userRole === "customer" && (
          <div>
            <h3 className="text-lg font-medium mb-4">Order Preferences</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Delivery Address
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter your default delivery address"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preferences;
