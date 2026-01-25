import asyncHandler from 'express-async-handler'
import Blog from '../models/Blog.js'

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// POST /api/blogs - Create blog (Admin only)
export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, category, thumbnail, author, isPublished } = req.body

  // Validation
  if (!title || !content || !category || !author) {
    res.status(400)
    throw new Error('Title, content, category, and author are required')
  }

  if (!['Tips', 'Legal Guide', 'Investment', 'News'].includes(category)) {
    res.status(400)
    throw new Error('Invalid category. Must be: Tips, Legal Guide, Investment, or News')
  }

  // Generate unique slug
  let slug = generateSlug(title)
  let slugExists = await Blog.findOne({ slug })
  let counter = 1
  while (slugExists) {
    slug = `${generateSlug(title)}-${counter}`
    slugExists = await Blog.findOne({ slug })
    counter++
  }

  const blog = await Blog.create({
    title,
    slug,
    content,
    category,
    thumbnail: thumbnail || '',
    author,
    isPublished: isPublished || false,
  })

  res.status(201).json({
    message: 'Blog created successfully',
    blog,
  })
})

// GET /api/blogs - Get all published blogs (Public)
export const getAllBlogs = asyncHandler(async (req, res) => {
  const { category } = req.query

  const query = { isPublished: true }
  if (category && category !== 'All') {
    query.category = category
  }

  const blogs = await Blog.find(query)
    .select('-content') // Exclude full content for list view
    .sort({ createdAt: -1 })
    .lean()

  res.status(200).json(blogs)
})

// GET /api/blogs/:slug - Get single blog by slug (Public)
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params

  const blog = await Blog.findOne({ slug, isPublished: true })

  if (!blog) {
    res.status(404)
    throw new Error('Blog not found')
  }

  res.status(200).json(blog)
})

// PUT /api/blogs/:id - Update blog (Admin only)
export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { title, content, category, thumbnail, author, isPublished } = req.body

  const blog = await Blog.findById(id)

  if (!blog) {
    res.status(404)
    throw new Error('Blog not found')
  }

  // Update fields
  if (title !== undefined) {
    blog.title = title
    // Regenerate slug if title changed
    if (title !== blog.title) {
      let slug = generateSlug(title)
      let slugExists = await Blog.findOne({ slug, _id: { $ne: id } })
      let counter = 1
      while (slugExists) {
        slug = `${generateSlug(title)}-${counter}`
        slugExists = await Blog.findOne({ slug, _id: { $ne: id } })
        counter++
      }
      blog.slug = slug
    }
  }
  if (content !== undefined) blog.content = content
  if (category !== undefined) {
    if (!['Tips', 'Legal Guide', 'Investment', 'News'].includes(category)) {
      res.status(400)
      throw new Error('Invalid category')
    }
    blog.category = category
  }
  if (thumbnail !== undefined) blog.thumbnail = thumbnail
  if (author !== undefined) blog.author = author
  if (isPublished !== undefined) blog.isPublished = isPublished

  await blog.save()

  res.status(200).json({
    message: 'Blog updated successfully',
    blog,
  })
})

// DELETE /api/blogs/:id - Delete blog (Admin only)
export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params

  const blog = await Blog.findById(id)

  if (!blog) {
    res.status(404)
    throw new Error('Blog not found')
  }

  await Blog.findByIdAndDelete(id)

  res.status(200).json({
    message: 'Blog deleted successfully',
  })
})

// GET /api/blogs/admin/all - Get all blogs including unpublished (Admin only)
export const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .lean()

  res.status(200).json(blogs)
})
