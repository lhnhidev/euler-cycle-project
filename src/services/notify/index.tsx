// NotificationProvider.tsx
import React, { createContext, useContext } from "react";
import { notification } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";

type NotificationType = "success" | "info" | "warning" | "error";

type NotificationContextType = {
  openNotification: (
    type: NotificationType,
    message: string,
    description: string,
    placement: NotificationPlacement,
  ) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    type: NotificationType,
    message: string,
    description: string,
    placement: NotificationPlacement = "bottomRight",
  ) => {
    api[type]({ message, description, placement });
  };

  return (
    <NotificationContext.Provider value={{ openNotification }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationWithIcon = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotificationWithIcon must be used inside NotificationProvider",
    );
  }
  return ctx.openNotification;
};
