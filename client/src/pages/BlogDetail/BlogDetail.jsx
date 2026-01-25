import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getBlogBySlug } from '../../utils/api'
import { PuffLoader } from 'react-spinners'
import './BlogDetail.css'

const BlogDetail = () => {
  const { slug } = useParams()

  const { data: blog, isLoading, isError } = useQuery(
    ['blog', slug],
    () => getBlogBySlug(slug),
    {
      refetchOnWindowFocus: false,
    }
  )

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="flexCenter" style={{ height: '60vh' }}>
          <PuffLoader color="#4066ff" size={60} />
        </div>
      </div>
    )
  }

  if (isError || !blog) {
    return (
      <div className="wrapper">
        <div className="flexCenter" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
          <span style={{ fontSize: '1.2rem', color: '#666' }}>Blog not found</span>
          <Link to="/blogs" className="blog-back-link">
            ← Back to Blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="wrapper">
      <div className="blog-detail-container">
        {/* Back Link */}
        <Link to="/blogs" className="blog-back-link">
          ← Back to Blogs
        </Link>

        {/* Blog Content */}
        <article className="blog-detail-article">
          {/* Category Badge */}
          <div className="blog-detail-category">{blog.category}</div>

          {/* Title */}
          <h1 className="blog-detail-title">{blog.title}</h1>

          {/* Meta Info */}
          <div className="blog-detail-meta">
            <span className="blog-detail-author">By {blog.author}</span>
            <span className="blog-detail-separator">•</span>
            <span className="blog-detail-date">{formatDate(blog.createdAt)}</span>
          </div>

          {/* Featured Image */}
          {blog.thumbnail && (
            <div className="blog-detail-image">
              <img
                src={`http://localhost:8000${blog.thumbnail}`}
                alt={blog.title}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Content */}
          <div
            className="blog-detail-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </div>
    </div>
  )
}

export default BlogDetail