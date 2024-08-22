import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { useGetAllNotificationCount } from '@/services/queries/admin/announcement';
import { BellRing, X } from 'lucide-react';
import notificationSound from '../../assets/notification-sound.mp3';
import moment from 'moment';
import {
  useDismissNotification,
  useReadNotification
} from '@/services/mutation/admin/announcement';

function NotificationCard() {
  const { schoolId, userType, staffId, studentId } = useSchoolContext();
  const id = userType === 'STAFF' ? staffId : studentId;
  const currentDate = new Date();
  const startDate = format(new Date(currentDate.setDate(currentDate.getDate() - 30)), 'yyyy-MM-dd');
  const endDate = format(new Date(), 'yyyy-MM-dd');
  const { data: notificationsData } = useGetAllNotificationCount(
    schoolId,
    userType,
    id,
    startDate,
    endDate
  );
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [previousNotificationCount, setPreviousNotificationCount] = useState(0);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [shake, setShake] = useState(false);
  const readNotificationMutation = useReadNotification();
  const dismissNotificationMutation = useDismissNotification();
  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData.data?.notifications || []);
      setNotificationCount(notificationsData?.data?.count);

      if (notificationsData?.data?.count > previousNotificationCount) {
        playNotificationSound();
        setShake(true);
        setTimeout(() => setShake(false), 1000);
      }
      setPreviousNotificationCount(notificationsData?.data?.count);
    }
  }, [notificationsData?.data]);

  const playNotificationSound = () => {
    const audio = new Audio(notificationSound);
    audio.play();
  };

  const handleNotificationClick = (notificationId: number) => {
    readNotificationMutation.mutate({ schoolId, payload: [notificationId] });
  };

  const handleDismissNotification = (notificationId: number) => {
    dismissNotificationMutation.mutate({ schoolId, payload: [notificationId] });
  };

  const handleDismissAllNotifications = () => {
    const allNotificationIds = notifications.map((notification) => notification.notificationId);
    dismissNotificationMutation.mutate({ schoolId, payload: allNotificationIds });
  };

  const handleToggleShowAll = () => {
    setShowAllNotifications((prev) => !prev);
  };

  const displayedNotifications = showAllNotifications ? notifications : notifications.slice(0, 5);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative">
            <Button variant="ghost" className={shake ? 'animate-shake' : ''}>
              <BellRing className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 bg-white dark:bg-slate-900 shadow-lg rounded-md max-h-96 overflow-y-auto">
          <div className="flex  px-4 py-1 justify-between items-center mb-2 border border-x-0 border-b-slate-100 dark:border-slate-700 border-t-0">
            <div>
              <p className="text-sm">Notifications</p>
            </div>
            <div>
              <div
                onClick={handleDismissAllNotifications}
                className="text-[10px] px-2 py-1 rounded-2xl cursor-pointer border border-slate-100 hover:bg-slate-100 dark:border-slate-950 dark:bg-slate-900 hover:dark:bg-slate-950"
              >
                Clear All
              </div>
            </div>
          </div>
          <div className="space-y-2 px-4 ">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-gray-500">No notifications available.</p>
            ) : (
              displayedNotifications.map((notification) => (
                <div
                  className={`border rounded-md  ${notification.read ? 'opacity-50' : 'opacity-100 dark:bg-gray-950'} cursor-pointer`}
                  key={notification.notificationId}
                  onClick={() => handleNotificationClick(notification.notificationId)}
                >
                  <div
                    className={
                      'flex justify-between relative bg-slate-200 dark:bg-gray-950 items-center rounded-t-md px-2 py-1'
                    }
                  >
                    <div className="flex justify-start gap-x-2 items-center">
                      <div>
                        <p className="text-[10px] bg-white dark:bg-slate-900 border border-slate-300 px-2 py-0 rounded-xl">
                          {notification.notificationType}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-950 px-2 py-0 rounded-xl">
                          {notification.recipientType} -{' '}
                          {moment(notification.dateTime).format('DD:MMMM:YYYY')}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div
                        onClick={() => handleDismissNotification(notification.notificationId)}
                        className="text-gray-400   hover:text-gray-900 absolute z-50 top-[1px]   right-[3px]"
                      >
                        <X className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-sm">{notification.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          {notifications.length > 5 && (
            <div className="mt-4 mb-4 px-4 text-center">
              <div
                onClick={handleToggleShowAll}
                className="text-xs w-full p-2 rounded-md cursor-pointer border border-slate-100 hover:bg-slate-100 dark:border-slate-950 dark:bg-slate-900 hover:dark:bg-slate-950"
              >
                {showAllNotifications ? 'Show Less' : 'Show More'}
              </div>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default NotificationCard;
