import mongoose from 'mongoose';
import IUser from './user.interface';

const addressSchema = new mongoose.Schema({
  city: String,
  country: String,
  street: String
});

const userSchema = new mongoose.Schema({
  address: addressSchema,
  email: String,
  name: String,
  password: String
});

userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    const retJson = {
      id: ret._id,
      name: ret.name,
      email: ret.email
    };
    return retJson;
  }
});

const userModel = mongoose.model<IUser & mongoose.Document>('User', userSchema);

export default userModel;
