type Role = "MEMBER" | "ADMIN" | "MENTOR"; // Define possible roles
type Gender = "MALE" | "FEMALE"; // Define possible genders

type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  congregation_id?: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
  gender?: Gender;
  group_id?: string;
  group?: Group;
  EventAttendance: EventAttendance[];
  mentoredGroups: Group[];
};

type Group = {
  id: string;
  name: string;
  mentor_id?: string;
  mentor?: User;
  mentees: User[];
  created_at: Date;
  updated_at: Date;
  connect_attendance: ConnectAttendance[];
};

type EventAttendance = {
  id: string;
  eventId: string;
  userId: string;
  // Add other fields as necessary
};

type ConnectAttendance = {
  id: string;
  groupId: string;
  date: Date;
  attendees: User[];
  // Add other fields as necessary
};
