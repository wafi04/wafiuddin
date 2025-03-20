export type User = {
  id: number; // Keep as number to match Prisma Int
  name: string | null;
  username: string;
  role: string;
  whatsapp: string | null;
  balance: string;
  api_key: string | null;
  otp: string | null;
  createdAt: Date | null
  updatedAt: Date | null
};
