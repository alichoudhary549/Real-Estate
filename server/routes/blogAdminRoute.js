import express from 'express'
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsAdmin,
} from '../controllers/blogCtrl.js'
import { adminProtect } from '../config/adminAuth.js'

const router = express.Router()

// All admin routes are protected
router.use(adminProtect)

router.get('/all', getAllBlogsAdmin)
router.post('/', createBlog)
router.put('/:id', updateBlog)
router.delete('/:id', deleteBlog)

export default router