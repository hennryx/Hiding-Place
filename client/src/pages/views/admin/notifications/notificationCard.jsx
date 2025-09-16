import React from 'react';
import Icons from '../../../../services/utilities/ICONS';
import useNotificationStore from '../../../../services/stores/notifications/notificationStore';
import useAuthStore from '../../../../services/stores/authStore';
import { NAL } from '../../../../components/modalAlert';

const NotificationCard = ({ notif }) => {
    const { token, auth } = useAuthStore();
    const { markAsRead, deleteNotification, archivedNotification } = useNotificationStore();
    const { ShoppingCart, Menu, Archived, Delete, Eye, Expiry } = Icons;

    const handleDelete = async (_id) => {
        const result = await NAL({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancel: true,
            confirmText: "Yes, Delete it!"
        })

        if (result.isConfirmed) {
            const data = { _id };
            await deleteNotification(token, data);
        }
    };

    const handleArchive = async (_id, isArchived) => {
        const data = {
            _id,
            readBy: auth._id,
            isArchived: !isArchived // Toggle
        };
        await archivedNotification(token, data);
    };

    const handleMarkAsRead = async (_id) => {
        const data = {
            _id,
            readBy: auth._id
        };
        await markAsRead(token, data);
    };

    // Icon based on type
    const getIcon = () => {
        switch (notif.type) {
            case 'LOW_STOCK': return <ShoppingCart />;
            case 'EXPIRY': return <Expiry />; // Add if you have
            case 'ORDER_STATUS': return <ShoppingCart />;
            default: return <ShoppingCart />;
        }
    };

    return (
        <div className="flex justify-between border border-[var(--primary-color)] rounded-md p-2">
            <div className='flex items-center justify-center px-4'>
                <div className="h-7 w-7 bg-white rounded-md flex items-center justify-center">
                    {getIcon()}
                </div>
            </div>

            <div className='flex flex-col flex-1 items-start justify-center'>
                <div className='flex gap-2'>
                    <p className='text-sm'>{notif.type}</p>
                    {!notif.isRead && <span className='bg-red-600 h-2 w-2 rounded-full' />}
                </div>
                <p className='text-xs'>{notif.message}</p>
                <p className='text-xs'>{new Date(notif.createdAt).toLocaleString()}</p>
            </div>

            <div className='flex items-start'>
                <div className="dropdown dropdown-end ">
                    <div tabIndex="0" role="button" className="m-1 bg-transparent text-black/80 cursor-pointer">
                        <Menu />
                    </div>
                    <ul tabIndex="0" className="dropdown-content menu bg-white rounded-box z-1 w-52 p-2 shadow-sm">
                        {!notif.isRead && (
                            <li onClick={() => handleMarkAsRead(notif._id)}>
                                <div className='flex gap-4'>
                                    <Eye />
                                    <span className='text-sm text-black/80'>Mark as Read</span>
                                </div>
                            </li>
                        )}
                        <li onClick={() => handleArchive(notif._id, notif.isArchived)}>
                            <div className='flex gap-4'>
                                <Archived />
                                <span className='text-sm text-black/80'>{notif.isArchived ? 'Unarchive' : 'Archive'}</span>
                            </div>
                        </li>
                        <li onClick={() => handleDelete(notif._id)}>
                            <div className='flex gap-4'>
                                <Delete />
                                <span className='text-sm text-red-600'>Delete</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NotificationCard;