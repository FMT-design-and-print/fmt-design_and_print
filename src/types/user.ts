export interface IUserDetails {
  id: string;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  profileImage?: string | null;
  phone?: any | null;
  country?: string | null;
  region?: string | null;
  gender?: string | null;
  dateOfBirth?: Date | null;
}
