import { Client } from 'minio';
import dotenv from 'dotenv';

dotenv.config();

const minioClient = new Client({
  endPoint:'minio',
  port: parseInt(process.env.MINIO_PORT, 10) || 9001,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});
//h2ljkPuavdPesURoHdIz
//FrUNLS2Z1f0FCeoS9nAw6NQ8xDPPQyJnoCx6iami
export default minioClient;