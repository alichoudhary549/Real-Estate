import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { getAllBlogs } from '../../utils/api'
import { PuffLoader } from 'react-spinners'
import './Blogs.css'

const categories = ['All', 'Tips', 'Legal Guide', 'Investment', 'News']

const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const { data: blogs, isLoading, isError } = useQuery(
    ['blogs', selectedCategory],
    () => getAllBlogs(selectedCategory),
    {
      refetchOnWindowFocus: false,
    }
  )

  // Helper function to get excerpt
  const getExcerpt = (content, maxLength = 150) => {
    if (!content) return ''
    const text = content.replace(/<[^>]*>/g, '') // Remove HTML tags
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isError) {
    return (
      <div className="wrapper">
        <div className="flexCenter" style={{ height: '60vh' }}>
          <span>Error while fetching blogs</span>
        </div>
      </div>
    )
  }

  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth blogs-container">
        <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', color: '#1f3e72' }}>
          Blog & Guides
        </h1>

        {/* Category Filter Tabs */}
        <div className="blog-category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`blog-category-tab ${
                selectedCategory === category ? 'active' : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flexCenter" style={{ height: '60vh' }}>
            <PuffLoader color="#4066ff" size={60} />
          </div>
        ) : (
          <>
            {/* Blogs Grid */}
            {blogs && blogs.length > 0 ? (
              <div className="blogs-grid">
                {blogs.map((blog) => (
                  <div key={blog._id} className="blog-card">
                    {blog.thumbnail && (
                      <div className="blog-card-image">
                        <img
                          src={`http://localhost:8000${blog.thumbnail}`}
                          alt={blog.title}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x250?text=No+Image'
                          }}
                        />
                      </div>
                    )}
                    <div className="blog-card-content">
                      <div className="blog-card-category">{blog.category}</div>
                      <h2 className="blog-card-title">{blog.title}</h2>
                      <p className="blog-card-excerpt">
                        {getExcerpt(blog.content || blog.description)}
                      </p>
                      <div className="blog-card-footer">
                        <span className="blog-card-date">
                          {formatDate(blog.createdAt)}
                        </span>
                        <Link
                          to={`/blogs/${blog.slug}`}
                          className="blog-card-link"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flexCenter" style={{ padding: '3rem', color: '#888' }}>
                <p>No blogs found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Blogs