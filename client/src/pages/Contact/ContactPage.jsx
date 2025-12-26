import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { sendContactMessage } from '../../utils/api';
import { toast } from 'react-toastify';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  // Contact email - you can change this to your actual email
  const contactEmail = '233549@students.au.edu.pk';

  // Mutation for sending contact form
  const mutation = useMutation(
    (data) => sendContactMessage(data),
    {
      onSuccess: (response) => {
        // Check if response indicates success
        if (response.data?.success) {
          toast.success(response.data?.message || 'Message sent successfully! We will get back to you soon.');
          // Reset form
          setFormData({ name: '', email: '', message: '' });
          setErrors({});
        } else {
          toast.error(response.data?.message || 'Failed to send message. Please try again.');
        }
      },
      onError: (error) => {
        // Extract error message from response
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send message. Please try again.';
        toast.error(errorMessage);
      },
    }
  );

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-page-container">
        <div className="contact-page-header">
          <h1 className="contact-page-title">Contact Us</h1>
          <p className="contact-page-subtitle">
            Have a question or want to get in touch? Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="contact-page-content">
          {/* Contact Information */}
          <div className="contact-info-section">
            <h2>Get in Touch</h2>
            <div className="contact-info-item">
              <div className="contact-info-icon">📧</div>
              <div>
                <h3>Email</h3>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">📞</div>
              <div>
                <h3>Phone</h3>
                <p>+92 3096894742</p>
              </div>
            </div>
            <div className="contact-info-note">
              <p>
                You can also reach us directly via email at{' '}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={errors.name ? 'error' : ''}
                  disabled={mutation.isLoading}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={errors.email ? 'error' : ''}
                  disabled={mutation.isLoading}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  rows="6"
                  className={errors.message ? 'error' : ''}
                  disabled={mutation.isLoading}
                />
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <button
                type="submit"
                className="contact-submit-button"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

