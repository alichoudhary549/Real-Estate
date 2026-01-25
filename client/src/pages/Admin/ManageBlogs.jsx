import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useAuth } from '../../context/AuthContext'
import {
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../../utils/api'
import { PuffLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import '../Admin/Admin.css'

const handleOpenModal = (blog = null) => {
    console.log('Opening modal', blog) // Add this line
    if (blog) {
      setEditingBlog(blog)
      setFormData({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        thumbnail: blog.thumbnail || '',
        isPublished: blog.isPublished,
      })
    } else {
      setEditingBlog(null)
      resetForm()
    }
    setIsModalOpen(true)
    console.log('Modal state:', isModalOpen) // Add this line
  }

const ManageBlogs = () => {
  const { token, user } = useAuth()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Tips',
    thumbnail: '',
    isPublished: false,
  })

  const { data: blogs, isLoading, isError } = useQuery(
    'adminBlogs',
    () => getAllBlogsAdmin(token),
    {
      enabled: !!token,
    }
  )

  const createMutation = useMutation(
    (data) => createBlog(data, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminBlogs')
        toast.success('Blog created successfully')
        setIsModalOpen(false)
        resetForm()
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to create blog')
      },
    }
  )

  const updateMutation = useMutation(
    ({ blogId, data }) => updateBlog(blogId, data, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminBlogs')
        toast.success('Blog updated successfully')
        setIsModalOpen(false)
        setEditingBlog(null)
        resetForm()
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to update blog')
      },
    }
  )

  const deleteMutation = useMutation(
    (blogId) => deleteBlog(blogId, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminBlogs')
        toast.success('Blog deleted successfully')
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to delete blog')
      },
    }
  )

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'Tips',
      thumbnail: '',
      isPublished: false,
    })
  }

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog)
      setFormData({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        thumbnail: blog.thumbnail || '',
        isPublished: blog.isPublished,
      })
    } else {
      setEditingBlog(null)
      resetForm()
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBlog(null)
    resetForm()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      author: user?.name || 'Admin',
    }

    if (editingBlog) {
      updateMutation.mutate({ blogId: editingBlog._id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleDelete = (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteMutation.mutate(blogId)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('http://localhost:8000/api/upload/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.imageUrl) {
        setFormData((prev) => ({ ...prev, thumbnail: data.imageUrl }))
        toast.success('Image uploaded successfully')
      }
    } catch (error) {
      toast.error('Failed to upload image')
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <PuffLoader color="#667eea" size={60} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="empty-state">
        <p className="empty-state-text">Error loading blogs</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#333' }}>Manage Blogs</h2>
        <button
          onClick={() => handleOpenModal()}
          className="admin-btn admin-btn-primary"
        >
          + Create Blog
        </button>
      </div>

      {blogs && blogs.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No blogs found. Create your first blog!</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs?.map((blog) => (
                <tr key={blog._id}>
                  <td style={{ maxWidth: '300px' }}>
                    <div style={{ fontWeight: '600' }}>{blog.title}</div>
                    <small style={{ color: '#888' }}>{blog.slug}</small>
                  </td>
                  <td>{blog.category}</td>
                  <td>{blog.author}</td>
                  <td>
                    <span className={`status-badge status-${blog.isPublished ? 'published' : 'draft'}`}>
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleOpenModal(blog)}
                        className="admin-btn admin-btn-small admin-btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="admin-btn admin-btn-small admin-btn-danger"
                        disabled={deleteMutation.isLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingBlog ? 'Edit Blog' : 'Create Blog'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter blog title"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="Tips">Tips</option>
                  <option value="Legal Guide">Legal Guide</option>
                  <option value="Investment">Investment</option>
                  <option value="News">News</option>
                </select>
              </div>

              <div className="form-group">
                <label>Thumbnail Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.thumbnail && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img
                      src={`http://localhost:8000${formData.thumbnail}`}
                      alt="Thumbnail"
                      style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '0.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, thumbnail: '' })}
                      style={{ 
                        marginTop: '0.5rem', 
                        padding: '0.25rem 0.5rem', 
                        fontSize: '0.85rem',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Content * (HTML supported)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows="12"
                  placeholder="Enter blog content. You can use HTML tags for formatting."
                  style={{ fontFamily: 'monospace' }}
                />
                <small style={{ color: '#666', marginTop: '0.25rem', display: 'block' }}>
                  Tip: Use HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt; for formatting
                </small>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  />
                  Publish immediately
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                >
                  {createMutation.isLoading || updateMutation.isLoading
                    ? 'Saving...'
                    : editingBlog
                    ? 'Update Blog'
                    : 'Create Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageBlogs