import mongoose from 'mongoose'
const { Schema, model } = mongoose

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
)

export default model('Category', categorySchema)
