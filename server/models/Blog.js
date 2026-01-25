import mongoose from 'mongoose'

const { Schema } = mongoose

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['Tips', 'Legal Guide', 'Investment', 'News'], 
      required: true 
    },
    thumbnail: { type: String },
    author: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Index for faster queries
blogSchema.index({ slug: 1 })
blogSchema.index({ category: 1, isPublished: 1 })

export default mongoose.model('Blog', blogSchema)