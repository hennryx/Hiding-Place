import React from "react";
import { Download, Upload } from "lucide-react";

const Backup = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Backup & Restore</h2>
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Create Backup</h3>
          <p className="text-sm text-gray-600 mb-4">
            Create a backup of your system data including inventory, orders, and
            customer information.
          </p>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            <Download size={16} />
            <span>Create Backup</span>
          </button>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Restore System</h3>
          <p className="text-sm text-gray-600 mb-4">
            Restore your system from a previous backup. This will overwrite
            current data.
          </p>
          <button className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
            <Upload size={16} />
            <span>Restore Backup</span>
          </button>
        </div>

        <div>
          <h3 className="font-medium mb-4">Backup History</h3>
          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Backup - Sept 10, 2025</p>
                  <p className="text-sm text-gray-500">Size: 45.2 MB</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  Download
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Backup - Sept 9, 2025</p>
                  <p className="text-sm text-gray-500">Size: 44.8 MB</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backup;
