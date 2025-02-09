import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Videos",
      },
    ],
    avatar: {
      type: String,
      requiered: true,
    },
    coverImage: {
      type: String, // cloudinary url
      requiered: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next()
  this.password = bcrypt.hash(this.password, 10)
  next()
}) // for encrypt password using mongoose hook pre with schema 

userSchema.methods.isPasswordCorrect = async function 
(password){
  return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function (){
  jwt.sign(
  {
    _id: this._id,
    username: this.username,
    fullname: this.fullname,
    email: this.email
  }, process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
  )
}

userSchema.methods.generateRefreshToken = function(){
  jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User", userSchema);
