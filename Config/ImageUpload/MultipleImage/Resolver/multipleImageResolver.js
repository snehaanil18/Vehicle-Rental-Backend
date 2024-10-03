import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { GraphQLUpload } from 'graphql-upload';
import minioClient from '../../../MinioClient/minio.js';

dotenv.config();

const resolvers = {
    Upload: GraphQLUpload,
  
    Mutation: {
      async uploadFiles(_, { files }) {
        const uploadedFiles = [];
  
        // Loop through each file and upload it to MinIO
        for (const file of files) {
          const { createReadStream, filename} = await file;
          const objectName = `${uuidv4()}-${filename}`;
          const bucketName = process.env.MINIO_BUCKET_NAME;
  
          try {
            const bucketExists = await minioClient.bucketExists(bucketName);

            if (!bucketExists) {
                console.log(`Bucket "${bucketName}" does not exist. Creating a new bucket.`);
                await minioClient.makeBucket(bucketName, 'us-east-1'); // Adjust the region if needed
                console.log(`Bucket "${bucketName}" created successfully.`);
              }

            await minioClient.putObject(bucketName, objectName, createReadStream());
            
            // Construct the file URL
            const url = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${objectName}`;
  
            // Add the uploaded file metadata to the array
            uploadedFiles.push(url);
          } catch (err) {
            console.error('Error uploading file:', err.message);
            throw new Error('Error uploading file: ' + err.message);
          }
        }
  
        // Return an array of uploaded files metadata
        return uploadedFiles;
      },
    },
};

export default resolvers;