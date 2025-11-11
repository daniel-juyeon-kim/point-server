interface User {
  userId: string;
  loginTime: string;
}

export type UserSession = Express.Request['session'] & Partial<User>;
