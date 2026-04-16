export interface AdminSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  phone: string;
  role: string;
}

export const adminSessionStorageKey = "madhupur_admin_session";
