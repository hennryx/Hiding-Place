import React, { useEffect, useState } from 'react';
import useAuthStore from '../../../../services/stores/authStore';
import useNotificationStore from '../../../../services/stores/notifications/notificationStore';
import NotificationCard from './notificationCard';
import Icons from '../../../../services/utilities/ICONS';

const Notification = () => {
    const { token, auth } = useAuthStore();
    const { getNotifications, connectSocket, disconnectSocket, data } = useNotificationStore();
    const [isActivePage, setIsActivePage] = useState('all');
    const { NotificationICON } = Icons

    const handleToggleActivePage = (page) => {
        setIsActivePage(page);
    };

    const handleFetchNotifications = (params = {}) => {
        getNotifications(token, params);
    };

    const filteredData = () => {
        console.log(data.filter(n => !n.isArchived).length)
        if (isActivePage === 'unread') return data.filter(n => !n.isRead);
        if (isActivePage === 'archived') return data.filter(n => n.isArchived);
        if (isActivePage === 'all') return data.filter(n => !n.isArchived);
        return data.filter(n => !n.isArchived);
    };

    useEffect(() => {
        if (token && auth?._id) {
            handleFetchNotifications({ page: 1, limit: 5, _id: auth._id });
            connectSocket(auth._id, token);
        }
        return () => disconnectSocket();
    }, [token, auth]);

    return (
        <div className="container p-4 h-dvh overflow-hidden">
            <div className="flex flex-col gap-5 pt-4">
                <h2 className='text-xl text-[var(--primary-color)]'>Notifications</h2>

                {/* Page Folder */}
                <div className='w-full flex gap-2'>
                    <div
                        className={`p-2 rounded-md cursor-pointer ${isActivePage === 'all' ? "bg-[var(--primary-color)] text-white shadow-md" : 'text-black/80 bg-gray-200'}`}
                        onClick={() => handleToggleActivePage('all')}
                    >
                        <span className='text-xs'>All({data.filter(n => !n.isArchived).length})</span>
                    </div>
                    <div
                        className={`p-2 rounded-md cursor-pointer ${isActivePage === 'unread' ? "bg-[var(--primary-color)] text-white shadow-md" : 'text-black/80 bg-gray-200'}`}
                        onClick={() => handleToggleActivePage('unread')}
                    >
                        <span className='text-xs'>Unread({data.filter(n => !n.isRead).length})</span>
                    </div>
                    <div
                        className={`p-2 rounded-md cursor-pointer ${isActivePage === 'archived' ? "bg-[var(--primary-color)] text-white shadow-md" : 'text-black/80 bg-gray-200'}`}
                        onClick={() => handleToggleActivePage('archived')}
                    >
                        <span className='text-xs'>Archived({data.filter(n => n.isArchived).length})</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {filteredData().map(notif => (
                        <NotificationCard key={notif._id} notif={notif} />
                    ))}

                </div>

                {filteredData().length === 0 && (
                    <div className='flex flex-col items-center justify-center'>
                        <div className='h-20 w-20'>
                            <NotificationICON className='w-full h-full text-black/80' />
                        </div>
                        <p>No notifications found</p>
                        <small>You're all caught up!</small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;