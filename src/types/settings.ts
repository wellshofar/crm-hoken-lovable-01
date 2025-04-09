
export interface UserSettings {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
}

export interface SystemSettings {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean;
  smtpFromEmail: string;
  smtpFromName: string;
}

export type SMTPSettings = Pick<
  SystemSettings,
  | "smtpHost"
  | "smtpPort"
  | "smtpUser"
  | "smtpPassword"
  | "smtpSecure"
  | "smtpFromEmail"
  | "smtpFromName"
>;
