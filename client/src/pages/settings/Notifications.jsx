import React from "react";

const Notifications = ({ userRole }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <h3 className="font-medium">Order Notifications</h3>
            <p className="text-sm text-gray-500">
              Get notified when orders are placed or updated
            </p>
          </div>
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600"
            defaultChecked
          />
        </div>
        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <h3 className="font-medium">Inventory Alerts</h3>
            <p className="text-sm text-gray-500">
              Get alerts for low stock items
            </p>
          </div>
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600"
            defaultChecked
          />
        </div>
        {userRole === "admin" && (
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h3 className="font-medium">System Updates</h3>
              <p className="text-sm text-gray-500">
                Get notified about system maintenance and updates
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600" />
          </div>
        )}
        <div className="flex items-center justify-between py-3">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-gray-500">
              Receive notifications via email
            </p>
          </div>
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600"
            defaultChecked
          />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
