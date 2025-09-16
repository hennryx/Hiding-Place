import React, { useEffect, useState } from "react";
import {
  User,
  Shield,
  Key,
  Bell,
  Settings,
  Database,
  ShoppingCart,
  Sliders,
} from "lucide-react";
import useAuthStore from "../../services/stores/authStore";
import PersonalInfo from "./PersonalInfo";
import Security from "./Security";
import Notifications from "./Notifications";
import Permissions from "./Permissions";
import System from "./System";
import Backup from "./Backup";
import Preferences from "./Preferences";
import OrderHistory from "./OrderHistory";

const AccountSettings = () => {
  const { role } = useAuthStore();
  const [userRole, setUserRole] = useState("admin");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (role) {
      console.log(role);

      setUserRole(role);
    }
  }, [role]);

  // Define settings tabs based on user role
  const getSettingsTabs = (role) => {
    const baseSettings = [
      {
        id: "personal",
        label: "Personal Info",
        icon: User,
        component: PersonalInfo,
      },
      {
        id: "security",
        label: "Security",
        icon: Shield,
        component: Security,
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        component: Notifications,
      },
    ];

    switch (role) {
      case "ADMIN":
        return [
          ...baseSettings,
          {
            id: "permissions",
            label: "Permissions",
            icon: Key,
            component: Permissions,
          },
          {
            id: "system",
            label: "System",
            icon: Settings,
            component: System,
          },
          {
            id: "backup",
            label: "Backup & Restore",
            icon: Database,
            component: Backup,
          },
        ];

      case "STAFF":
        return [
          ...baseSettings,
          {
            id: "preferences",
            label: "Preferences",
            icon: Sliders,
            component: Preferences,
          },
        ];

      case "CUSTOMER":
        return [
          ...baseSettings,
          {
            id: "preferences",
            label: "Preferences",
            icon: Sliders,
            component: Preferences,
          },
          {
            id: "orders",
            label: "Order History",
            icon: ShoppingCart,
            component: OrderHistory,
          },
        ];

      default:
        return baseSettings;
    }
  };

  const settingsTabs = getSettingsTabs(userRole);
  const ActiveComponent = settingsTabs[activeTab]?.component || PersonalInfo;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {userRole === "admin"
              ? "Admin Account Settings"
              : "Account Settings"}
          </h1>
          <p className="text-gray-600">
            Manage your {userRole} account preferences and settings
          </p>
        </div>

        {/* Settings Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {settingsTabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(index)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === index
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <ActiveComponent userRole={userRole} />
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
