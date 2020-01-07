declare module '@random-guys/notification' {
  export type NotificationChannel = 'email' | 'sms' | 'push_notification';

  export interface Notification {
    recipient?: string | string[];
    message: string;
    subject: string;
    channel: NotificationChannel;
  }

  export interface PushNotification extends Notification {
    data?: { [key: string]: string };
    tokens: string[];
  }
}
