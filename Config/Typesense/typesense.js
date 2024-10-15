import Typesense from 'typesense';
import dotenv from 'dotenv';

dotenv.config();

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: 'epbu1yc5zja4r32sp-1.a1.typesense.net', 
      port: '443',
      protocol: 'https',
    }
  ],
  apiKey: process.env.TYPESENSE_API_KEY, 
  connectionTimeoutSeconds: 8,
});

export default typesenseClient;