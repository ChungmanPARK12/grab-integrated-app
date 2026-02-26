// refreshToken.utils
import crypto from 'crypto';
import { prisma } from "../../libs/prisma";

export const hashRefreshToken = (token: string): string => {
  return crypto
    .createHash('sha256')
    .update(token + process.env.REFRESH_TOKEN_PEPPER!)
    .digest('hex');
};

export const storeRefreshToken = async ({
  userId,
  refreshToken,
  expiresAt,
}: {
  userId: string;
  refreshToken: string;
  expiresAt: Date;
}) => {
  const tokenHash = hashRefreshToken(refreshToken);

  return prisma.refreshToken.create({
    data: { userId, tokenHash, expiresAt },
  });
};

export const findValidRefreshToken = async (refreshToken: string) => {
  const tokenHash = hashRefreshToken(refreshToken);

  return prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
  });
};

export const revokeRefreshToken = async (refreshToken: string) => {
  const tokenHash = hashRefreshToken(refreshToken);

  return prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};