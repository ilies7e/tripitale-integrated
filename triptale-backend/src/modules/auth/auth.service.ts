import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { env } from '../../config/env';
import type { LoginInput, RegisterInput } from './auth.schema';

const PUBLIC_USER = {
  id: true,
  username: true,
  email: true,
  fullName: true,
  profilePicture: true,
  bio: true,
  isPremium: true,
  isVerifiedPremium: true,
  createdAt: true,
} as const;

const parseDuration = (s: string): number => {
  const m = /^(\d+)([smhdw])$/.exec(s);
  if (!m) return 30 * 24 * 3600 * 1000;
  const n = Number(m[1]);
  const mult: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000 };
  return n * mult[m[2]];
};

const issueTokens = async (userId: number, username: string, email: string) => {
  const access = signAccessToken({ sub: userId, username, email });
  const jti = crypto.randomUUID();
  const refresh = signRefreshToken({ sub: userId, jti });
  await prisma.refreshToken.create({
    data: {
      token: refresh,
      userId,
      expiresAt: new Date(Date.now() + parseDuration(env.JWT_REFRESH_EXPIRES_IN)),
    },
  });
  return { accessToken: access, refreshToken: refresh };
};

const deriveUsername = (input: RegisterInput) => {
  if (input.username) return input.username;
  const base = (input.fullName ?? input.email.split('@')[0])
    .toLowerCase()
    .replace(/[^a-z0-9_.-]+/g, '_')
    .replace(/^[_.-]+|[_.-]+$/g, '')
    .slice(0, 24) || 'user';
  return base;
};

const uniqueUsername = async (base: string) => {
  let candidate = base;
  let n = 0;
  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    n += 1;
    candidate = `${base}${n}`.slice(0, 30);
  }
  return candidate;
};

export const register = async (input: RegisterInput) => {
  const emailTaken = await prisma.user.findUnique({ where: { email: input.email } });
  if (emailTaken) throw ApiError.conflict('Email already in use');

  const baseUsername = deriveUsername(input);
  if (input.username) {
    const clash = await prisma.user.findUnique({ where: { username: input.username } });
    if (clash) throw ApiError.conflict('Username already in use');
  }
  const username = input.username ?? (await uniqueUsername(baseUsername));

  const hashed = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email: input.email,
      password: hashed,
      fullName: input.fullName,
      bio: input.bio,
    },
    select: PUBLIC_USER,
  });
  const tokens = await issueTokens(user.id, user.username, user.email);
  return { user, ...tokens };
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw ApiError.unauthorized('Invalid credentials');
  const ok = await bcrypt.compare(input.password, user.password);
  if (!ok) throw ApiError.unauthorized('Invalid credentials');

  const tokens = await issueTokens(user.id, user.username, user.email);
  const { password: _password, ...publicUser } = user;
  void _password;
  return { user: publicUser, ...tokens };
};

export const refresh = async (refreshToken: string) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid refresh token');
  }
  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    throw ApiError.unauthorized('Refresh token expired or revoked');
  }
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw ApiError.unauthorized('User no longer exists');

  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });
  const tokens = await issueTokens(user.id, user.username, user.email);
  return tokens;
};

export const logout = async (refreshToken: string) => {
  await prisma.refreshToken.updateMany({
    where: { token: refreshToken },
    data: { revoked: true },
  });
};

export const me = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: PUBLIC_USER });
  if (!user) throw ApiError.notFound('User not found');
  return user;
};
