import React, { useState, useRef, useEffect } from "react";
import {
    User,
    Lock,
    Settings,
    Shield,
    Users,
    Database,
    Bell,
    Palette,
    Activity,
    Eye,
    EyeOff,
    Check,
    X,
} from "lucide-react";
import useAuthStore from "../../services/stores/authStore";

const toast = {
    success: (msg) => console.log("Success:", msg),
    error: (msg) => console.log("Error:", msg),
};

const NoImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";

const Account = () => {
    const { auth, token, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState("profile");
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    // Profile states
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        firstname: auth?.firstname || "",
        middlename: auth?.middlename || "",
        lastname: auth?.lastname || "",
        email: auth?.email || "",
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    // Password states
    const [changePasswordMode, setChangePasswordMode] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [viewPass, setViewPass] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        hasNumber: false,
        hasSpecial: false,
    });

    // Role-based navigation items
    const getNavigationItems = (role) => {
        const baseItems = [
            {
                id: "profile",
                label: "Profile",
                icon: User,
                description: "Manage your personal information",
            },
            {
                id: "security",
                label: "Security",
                icon: Lock,
                description: "Password and security settings",
            },
            {
                id: "notifications",
                label: "Notifications",
                icon: Bell,
                description: "Manage your notification preferences",
            },
            {
                id: "preferences",
                label: "Preferences",
                icon: Palette,
                description: "Customize your experience",
            },
        ];

        if (role === "STAFF") {
            return baseItems;
        }

        if (role === "ADMIN") {
            return [
                ...baseItems,
                {
                    id: "user-management",
                    label: "User Management",
                    icon: Users,
                    description: "Manage staff accounts",
                },
                {
                    id: "system-settings",
                    label: "System Settings",
                    icon: Settings,
                    description: "Configure system preferences",
                },
                {
                    id: "activity-logs",
                    label: "Activity Logs",
                    icon: Activity,
                    description: "View system activity",
                },
            ];
        }

        if (role === "SUPER_ADMIN") {
            return [
                ...baseItems,
                {
                    id: "user-management",
                    label: "User Management",
                    icon: Users,
                    description: "Manage all user accounts",
                },
                {
                    id: "admin-management",
                    label: "Admin Management",
                    icon: Shield,
                    description: "Manage admin accounts",
                },
                {
                    id: "system-settings",
                    label: "System Settings",
                    icon: Settings,
                    description: "Configure system preferences",
                },
                {
                    id: "database",
                    label: "Database",
                    icon: Database,
                    description: "Database management and backups",
                },
                {
                    id: "activity-logs",
                    label: "Activity Logs",
                    icon: Activity,
                    description: "View all system activity",
                },
            ];
        }

        return baseItems;
    };

    const navigationItems = getNavigationItems(auth?.role);

    useEffect(() => {
        if (auth?.profileImage) {
            setImagePreview(auth.profileImage.url);
        }
    }, [auth]);

    useEffect(() => {
        setPasswordStrength({
            length: passwordForm.newPassword.length >= 8,
            hasNumber: /\d/.test(passwordForm.newPassword),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword),
        });
    }, [passwordForm.newPassword]);

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match("image.*")) {
                toast.error("Please select an image file");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            setProfileImage(file);

            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success("Profile updated successfully");
            setEditMode(false);
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordForm.currentPassword) {
            toast.error("Please enter your current password");
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success("Password changed successfully");
            setChangePasswordMode(false);
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            toast.error("Failed to change password");
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStrengthPercentage = () => {
        const { length, hasNumber, hasSpecial } = passwordStrength;
        const criteriaCount = [length, hasNumber, hasSpecial].filter(
            Boolean
        ).length;
        return (criteriaCount / 3) * 100;
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "SUPER_ADMIN":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "ADMIN":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "STAFF":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Profile Settings
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Manage your personal information and profile
                                picture
                            </p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Profile Picture */}
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center mb-4 ring-4 ring-gray-50">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Profile"
                                                className="object-cover w-full h-full"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = NoImage;
                                                }}
                                            />
                                        ) : (
                                            <User className="w-12 h-12 text-gray-400" />
                                        )}
                                    </div>

                                    {editMode && (
                                        <>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <button
                                                onClick={triggerFileInput}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                            >
                                                Change Photo
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1">
                                    {editMode ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="firstname"
                                                        value={form.firstname}
                                                        onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Middle Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="middlename"
                                                        value={form.middlename}
                                                        onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="lastname"
                                                        value={form.lastname}
                                                        onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    onClick={() =>
                                                        setEditMode(false)
                                                    }
                                                    disabled={isLoading}
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={isLoading}
                                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                                >
                                                    {isLoading
                                                        ? "Saving..."
                                                        : "Save Changes"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-sm text-gray-500 mb-1">
                                                        First Name
                                                    </p>
                                                    <p className="font-medium text-gray-900">
                                                        {form.firstname}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-sm text-gray-500 mb-1">
                                                        Middle Name
                                                    </p>
                                                    <p className="font-medium text-gray-900">
                                                        {form.middlename ||
                                                            "Not provided"}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-sm text-gray-500 mb-1">
                                                        Last Name
                                                    </p>
                                                    <p className="font-medium text-gray-900">
                                                        {form.lastname}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-sm text-gray-500 mb-1">
                                                        Email
                                                    </p>
                                                    <p className="font-medium text-gray-900">
                                                        {form.email}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-sm text-gray-500 mb-1">
                                                        Role
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(
                                                                auth?.role
                                                            )}`}
                                                        >
                                                            {auth?.role?.replace(
                                                                "_",
                                                                " "
                                                            ) || "User"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    onClick={() =>
                                                        setEditMode(true)
                                                    }
                                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Edit Profile
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "security":
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Security Settings
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Manage your password and security preferences
                            </p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            {changePasswordMode ? (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Change Password
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={
                                                        viewPass.current
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    name="currentPassword"
                                                    value={
                                                        passwordForm.currentPassword
                                                    }
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                                    onClick={() =>
                                                        setViewPass((prev) => ({
                                                            ...prev,
                                                            current:
                                                                !prev.current,
                                                        }))
                                                    }
                                                >
                                                    {viewPass.current ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={
                                                        viewPass.new
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    name="newPassword"
                                                    value={
                                                        passwordForm.newPassword
                                                    }
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                                    onClick={() =>
                                                        setViewPass((prev) => ({
                                                            ...prev,
                                                            new: !prev.new,
                                                        }))
                                                    }
                                                >
                                                    {viewPass.new ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>

                                            {passwordForm.newPassword && (
                                                <div className="mt-3">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all ${
                                                                calculateStrengthPercentage() <=
                                                                33
                                                                    ? "bg-red-500"
                                                                    : calculateStrengthPercentage() <=
                                                                      66
                                                                    ? "bg-yellow-500"
                                                                    : "bg-green-500"
                                                            }`}
                                                            style={{
                                                                width: `${calculateStrengthPercentage()}%`,
                                                            }}
                                                        ></div>
                                                    </div>

                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            {passwordStrength.length ? (
                                                                <Check className="w-4 h-4 text-green-600" />
                                                            ) : (
                                                                <X className="w-4 h-4 text-red-500" />
                                                            )}
                                                            <span
                                                                className={
                                                                    passwordStrength.length
                                                                        ? "text-green-600"
                                                                        : "text-gray-600"
                                                                }
                                                            >
                                                                At least 8
                                                                characters
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            {passwordStrength.hasNumber ? (
                                                                <Check className="w-4 h-4 text-green-600" />
                                                            ) : (
                                                                <X className="w-4 h-4 text-red-500" />
                                                            )}
                                                            <span
                                                                className={
                                                                    passwordStrength.hasNumber
                                                                        ? "text-green-600"
                                                                        : "text-gray-600"
                                                                }
                                                            >
                                                                At least 1
                                                                number
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            {passwordStrength.hasSpecial ? (
                                                                <Check className="w-4 h-4 text-green-600" />
                                                            ) : (
                                                                <X className="w-4 h-4 text-red-500" />
                                                            )}
                                                            <span
                                                                className={
                                                                    passwordStrength.hasSpecial
                                                                        ? "text-green-600"
                                                                        : "text-gray-600"
                                                                }
                                                            >
                                                                At least 1
                                                                special
                                                                character
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={
                                                        viewPass.confirm
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    name="confirmPassword"
                                                    value={
                                                        passwordForm.confirmPassword
                                                    }
                                                    onChange={
                                                        handlePasswordChange
                                                    }
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                                    onClick={() =>
                                                        setViewPass((prev) => ({
                                                            ...prev,
                                                            confirm:
                                                                !prev.confirm,
                                                        }))
                                                    }
                                                >
                                                    {viewPass.confirm ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                            {passwordForm.newPassword &&
                                                passwordForm.confirmPassword &&
                                                passwordForm.newPassword !==
                                                    passwordForm.confirmPassword && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        Passwords do not match
                                                    </p>
                                                )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() =>
                                                setChangePasswordMode(false)
                                            }
                                            disabled={isLoading}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleChangePassword}
                                            disabled={isLoading}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                        >
                                            {isLoading
                                                ? "Updating..."
                                                : "Update Password"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Password
                                            </h3>
                                            <p className="text-gray-600">
                                                Last changed 30 days ago
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setChangePasswordMode(true)
                                            }
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Change Password
                                        </button>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Two-Factor Authentication
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-900">
                                                    Enable 2FA
                                                </p>
                                                <p className="text-gray-600">
                                                    Add an extra layer of
                                                    security to your account
                                                </p>
                                            </div>
                                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                                Configure
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case "notifications":
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Notification Settings
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Choose what notifications you want to receive
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <p className="text-gray-500">
                                Notification preferences coming soon...
                            </p>
                        </div>
                    </div>
                );

            case "preferences":
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Preferences
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Customize your application experience
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <p className="text-gray-500">
                                User preferences coming soon...
                            </p>
                        </div>
                    </div>
                );

            case "user-management":
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                User Management
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Manage user accounts and permissions
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <p className="text-gray-500">
                                User management interface coming soon...
                            </p>
                        </div>
                    </div>
                );

            case "admin-management":
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Admin Management
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Manage administrator accounts
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <p className="text-gray-500">
                                Admin management interface coming soon...
                            </p>
                        </div>
                    </div>
                );

            case "system-settings":
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                System Settings
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Configure system-wide preferences
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <p className="text-gray-500">
                                System settings coming soon...
                            </p>
                        </div>
                    </div>
                );

            case "database":
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Database Management
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Manage database and backups
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <p className="text-gray-500">
                                Database management tools coming soon...
                            </p>
                        </div>
                    </div>
                );

            case "activity-logs":
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Activity Logs
                            </h2>
                            <p className="text-gray-600 mt-1">
                                View system activity and audit logs
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <p className="text-gray-500">
                                Activity logs coming soon...
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Settings
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your account and system preferences
                    </p>
                </div>

                <div className="flex gap-8">
                    {/* Left Sidebar Navigation */}
                    <div className="w-80 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            {/* User Profile Header */}
                            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-sm overflow-hidden flex items-center justify-center ring-2 ring-white">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Profile"
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <User className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{`${form.firstname} ${form.lastname}`}</h3>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(
                                                auth?.role
                                            )}`}
                                        >
                                            {auth?.role?.replace("_", " ") ||
                                                "User"}
                                        </span>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {form.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Items */}
                            <nav className="p-2">
                                {navigationItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() =>
                                                setActiveTab(item.id)
                                            }
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 mb-1 ${
                                                activeTab === item.id
                                                    ? "bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600 ml-0"
                                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                        >
                                            <Icon
                                                className={`w-5 h-5 ${
                                                    activeTab === item.id
                                                        ? "text-blue-600"
                                                        : "text-gray-500"
                                                }`}
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">
                                                    {item.label}
                                                </div>
                                                <div
                                                    className={`text-xs ${
                                                        activeTab === item.id
                                                            ? "text-blue-600"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    {item.description}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Logout Button */}
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <button
                                    onClick={logout}
                                    className="w-full px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm border border-red-200"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 min-w-0">{renderContent()}</div>
                </div>
            </div>
        </div>
    );
};

export default Account;
