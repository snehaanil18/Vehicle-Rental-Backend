import userController from '../../Controllers/userController.js';
import uploadResolver from '../../../../../Config/ImageUpload/singleImage/Resolver/uploadResolver.js'

const userResolver = {
  Query: {
    // Fetch all users
    users: async () => {
      return await userController.getAllUsers();
    },

    // Fetch a single user by ID
    user: async (parent, args) => {
      const { id } = args;
      return await userController.getUserById(id);
    },
  },

  Mutation: {
    // Create a new user
    createUser: async (parent, { name, email, password, phone, city, state, country, pincode }) => {
      return await userController.createUser({ name, email, password, phone, city, state, country, pincode });
    },

    // Update an existing user by ID
    updateUser: async (parent, { id, name, email, phone, city, state, country, pincode }) => {
      return await userController.updateUser({ id, name, email, phone, city, state, country, pincode });
    },

    // Delete a user by ID
    deleteUser: async (parent, { id }) => {
      return await userController.deleteUser(id);
    },

    // Login a user
    loginUser: async (parent, { email, password }) => {
      return await userController.loginUser(email, password);
    },

    updateProfileImage: async (parent, { id, file }) => {
      const profileUrl = await uploadResolver.Mutation.uploadFile(null, { file });
      return await userController.updateUserProfileImage(id,profileUrl);      
    }
  
  },
};

export default userResolver;
