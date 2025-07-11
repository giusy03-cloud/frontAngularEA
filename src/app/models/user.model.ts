export interface User {
  id: number;
  name: string;
  username: string;
  password:string;
  role: string;
  accessType: string;
  invitationCode?: string; // solo se necessario per ORGANIZER
}
