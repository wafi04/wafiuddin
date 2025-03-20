import { z } from 'zod';

export const configWeb = z.object({
  id: z.number().int().positive(),
  judulWeb: z.string().min(1),
  deskripsiWeb: z.string().min(1),
  keyword: z.string().min(1),
  ogImage: z.string().nullable(),
  logoHeader: z.string().nullable(),
  logoFooter: z.string().nullable(),
  logoFavicon: z.string().nullable(),
  logoBanner: z.string().nullable(),
  logoCs: z.string().nullable(),
  urlWa: z.string().url(),
  urlIg: z.string().url(),
  urlTiktok: z.string().url(),
  urlYoutube: z.string().url(),
  urlFb: z.string().url(),
  kbrstoreApi: z.string().min(1),
  sloganWeb: z.string().min(1),
  snk: z.string().min(1),
  privacy: z.string().min(1),
  warna1: z.string().min(1),
  warna2: z.string().min(1),
  warna3: z.string().min(1),
  warna4: z.string().min(1),
  warna5: z.string().min(1),
  hargaGold: z.string().min(1),
  hargaPlatinum: z.string().min(1),
  tripayApi: z.string().nullable(),
  tripayMerchantCode: z.string().nullable(),
  tripayPrivateKey: z.string().nullable(),
  duitkuKey: z.string().nullable(),
  duitkuMerchant: z.string().nullable(),
  usernameDigi: z.string().nullable(),
  apiKeyDigi: z.string().nullable(),
  apigamesSecret: z.string().nullable(),
  apigamesMerchant: z.string().nullable(),
  vipApiid: z.string().nullable(),
  vipApikey: z.string().nullable(),
  digiSellerUser: z.string().nullable(),
  digiSellerKey: z.string().nullable(),
  nomorAdmin: z.string().nullable(),
  waKey: z.string().nullable(),
  waNumber: z.string().nullable(),
  ovoAdmin: z.string().nullable(),
  ovo1Admin: z.string().nullable(),
  gopayAdmin: z.string().nullable(),
  gopay1Admin: z.string().nullable(),
  danaAdmin: z.string().nullable(),
  shopeepayAdmin: z.string().nullable(),
  bcaAdmin: z.string().nullable(),
  mandiriAdmin: z.string().nullable(),
  logoCeo: z.string().nullable(),
  sejarah: z.string().min(1),
  sejarah1: z.string().min(1),
  visi: z.string().min(1),
  misi: z.string().min(1),
  namaCeo: z.string().min(1),
  deskripsiCeo: z.string().min(1),
  namaBagan: z.string().min(1),
  alamat: z.string().min(1),
  telp: z.string().min(1),
  email: z.string().email(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  waPending: z.string().nullable(),
  waPaid: z.string().nullable(),
  waProcess: z.string().nullable(),
  waSuccess: z.string().nullable(),
});

export type CreateConfigWeb = z.infer<typeof configWeb>;
export type UpdateConfigWeb = Partial<CreateConfigWeb>;
export type ConfigWeb = CreateConfigWeb & {
  createdAt: string;
  updatedAt: string;
};
