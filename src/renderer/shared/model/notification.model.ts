export interface Notification {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  read: boolean;
  icon: string;
}
