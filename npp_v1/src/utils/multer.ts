import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      console.log('test', file);

      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      const originalName = file.originalname;
      const extension = extname(originalName);
      const uniqueFilename = `${randomName}${extension}`;
      callback(null, uniqueFilename);
    },
  }),
};
