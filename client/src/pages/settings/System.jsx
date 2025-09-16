import React from "react";

const System = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">System Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">General Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Maintenance Mode</span>
              <input type="checkbox" className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto Backup</span>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600"
                defaultChecked
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4">Store Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Store Name"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Store Address"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default System;
