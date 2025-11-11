interface User {
  userId: string;
  loginTime: string;
}

export type PartialUserSession = Express.Request['session'] & Partial<User>;
export type UserSession = Express.Request['session'] & User;
