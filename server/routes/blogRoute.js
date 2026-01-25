import express from 'express'
import {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsAdmin,
} from '../controllers/blogCtrl.js'
import { adminProtect } from '../config/adminAuth.js'
import blogAdminRoute from './blogAdminRoute.js'

const router = express.Router()

// Public routes
router.get('/', getAllBlogs)

// Admin routes (protected) - MUST come before /:slug
router.post('/', adminProtect, createBlog)
router.get('/admin/all', adminProtect, getAllBlogsAdmin)
router.put('/:id', adminProtect, updateBlog)
router.delete('/:id', adminProtect, deleteBlog)

// Parameterized route for blog slugs - MUST be last
router.get('/:slug', getBlogBySlug)

export default router