import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { env } from '../config/env';

const uploadDir = path.resolve(env.UPLOAD_DIR);
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${base || 'media'}-${unique}${ext.toLowerCase()}`);
  },
});

const allowed = /^(image|video)\//;

export const upload = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image/* and video/* uploads are allowed'));
  },
});

export const inferMediaType = (mimetype: string): 'image' | 'video' =>
  mimetype.startsWith('video/') ? 'video' : 'image';
