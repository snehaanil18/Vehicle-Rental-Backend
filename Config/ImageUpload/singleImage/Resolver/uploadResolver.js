import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { GraphQLUpload } from 'graphql-upload';
import minioClient from '../../../MinioClient/minio.js';

dotenv.config();

const resolvers = {
  Upload: GraphQLUpload,

  Mutation: {
    async uploadFile(_, { file }) {
      if (!file) {
        throw new Error("No file uploaded");
      }
      
      const { createReadStream, filename } = await file;

      const objectName = `${uuidv4()}-${filename}`;
   
      const bucketName = process.env.MINIO_BUCKET_IMG;      
      if (!bucketName) {
        throw new Error('MinIO bucket name is not defined in environment variables');
      }

      // Upload file to MinIO
      try {
        // Check if the bucket exists
        const bucketExists = await minioClient.bucketExists(bucketName);
        
       // If the bucket doesn't exist, create it
        if (!bucketExists) {
          console.log(`Bucket "${bucketName}" does not exist. Creating a new bucket.`);
          await minioClient.makeBucket(bucketName, 'us-east-1'); // Adjust the region if needed
          console.log(`Bucket "${bucketName}" created successfully.`);
        }

        await minioClient.putObject(
          bucketName,
          objectName,
          createReadStream()
        );

      } catch (err) {
        console.log(err.message);
        throw new Error('Error uploading file: ' + err.message);


      }

      // Construct the file URL (make sure the environment variables are correct)
      const url = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${objectName}`;
      console.log(url);
      

      // Return the file metadata and URL
      return url;
    },
  },
};

export default resolvers;