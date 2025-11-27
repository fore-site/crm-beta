
export type Page = 'Dashboard' | 'Clients' | 'Adverts' | 'Analytics';

export type ViewType = 'grid' | 'list';

export type Currency = 'USD' | 'NGN';

export type NavigationState = {
  page: Page;
  detailId?: string | null;
};

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  avatarUrl: string;
  createdAt: string;
}

export type AdvertChannel = 'Email' | 'SMS';
export type AdvertStatus = 'Sent' | 'Scheduled' | 'Draft';

export interface Advert {
  id: string;
  title: string;
  message: string;
  channel: AdvertChannel;
  status: AdvertStatus;
  scheduledAt: string | null;
  createdAt: string;
  imageUrl?: string | null;
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export interface ChartData {
    name: string;
    value: number;
}