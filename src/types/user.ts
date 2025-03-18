interface UserLoginData {
  username: string;
  password: string;
}
interface UserRegisterData {
  username: string;
  email: string;
  password: string;
}

interface UserData {
  username: string;
  email: string;
  id: number;
  is_active: boolean;
  created_at: string;
}

export type { UserData, UserLoginData, UserRegisterData };
