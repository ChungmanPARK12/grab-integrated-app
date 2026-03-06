// modules/auth/refreshToken.utils
import crypto from 'crypto';
import { prisma } from "../../libs/prisma";

export const hashRefreshToken = (token: string): string => {
  const pepper = process.env.JWT_REFRESH_PEPPER;

  if (!pepper) {
    throw new Error("server misconfigured: missing JWT_REFRESH_PEPPER");
  }

  return crypto
    .createHash('sha256')
    .update(token + pepper)
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

export const cleanupExpiredRefreshTokens = async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.deleteMany({
    where: {
      OR: [
        {
          expiresAt: { lt: new Date() },
        },
        {
          revokedAt: { lt: sevenDaysAgo },
        },
      ],
    },
  });
};
