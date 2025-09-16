import React from "react";

const Security = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4">
            Two-Factor Authentication
          </h3>
          <div className="flex items-center space-x-3">
            <input type="checkbox" className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-700">
              Enable two-factor authentication
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Update Security
        </button>
      </div>
    </div>
  );
};

export default Security;
