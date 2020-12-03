import mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import validator from 'validator';
import config from 'config'
import { IUserModel, IUserSchema } from '../interfaces';


// const { Task } = require('./task')

const jwtSecretPhrase = process.env.JWT_SECRET_PHRASE || config.get<string>('secret.secretPhrase');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    trim: true,
    required: true,
  },
  updatedAt: {
    type: Date,
    trim: true,
    required: true,
  },
  nickName: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is not valid');
      }

      return true;
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value: string) {
      if (validator.contains(value.toLowerCase(), 'password')) {
        throw new Error('Password can not contain word "password"');
      }

      return true;
    },
  },
  role: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
}, {
  timestamps: true,
});

userSchema.statics.findByCredentials = async (email: string, password: string): Promise<IUserSchema> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error('Unable to login');
  }

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, jwtSecretPhrase);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// Hash the password before saving
userSchema.pre<IUserSchema>('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    this.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

export const User = mongoose.model<IUserSchema, IUserModel>('User', userSchema);

