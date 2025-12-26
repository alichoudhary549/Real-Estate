# Contact Form Setup Guide

This guide explains how to set up the contact form functionality for the Real Estate Booking Web App.

## Backend Setup

### 1. Install Nodemailer

First, install the required package:

```bash
cd server
npm install nodemailer
```

### 2. Configure Environment Variables

Add the following environment variables to your `server/.env` file:

```env
# Contact Email Configuration
CONTACT_EMAIL=your-email@gmail.com

# SMTP Configuration (for Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Gmail Setup (if using Gmail)

If you're using Gmail, you need to:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this app password as `SMTP_PASS` (not your regular Gmail password)

### 4. Other Email Providers

For other email providers, update the SMTP settings:

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

**Custom SMTP:**
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587  # or 465 for SSL
```

### 5. Test the Setup

Start your server and test the contact form:

```bash
cd server
npm start
```

## Frontend Setup

The frontend is already configured. The contact page is available at `/contact` route.

### Update Contact Email Display

To change the contact email displayed on the page, edit `client/src/pages/Contact/ContactPage.jsx`:

```javascript
const contactEmail = 'your-email@gmail.com'; // Change this line
```

## API Endpoint

**POST** `/api/contact/send`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your message has been sent successfully! We will get back to you soon.",
  "messageId": "email-message-id"
}
```

**Error Response (400/500):**
```json
{
  "message": "Error message here"
}
```

## Features

- ✅ Form validation (required fields, email format, message length)
- ✅ Success and error toast notifications
- ✅ Responsive design
- ✅ Clean, modern UI
- ✅ Email sent with HTML formatting
- ✅ Reply-to address set to sender's email
- ✅ Proper error handling

## Troubleshooting

### Email not sending

1. **Check SMTP credentials** - Verify your email and password are correct
2. **Check App Password** - For Gmail, ensure you're using an app password, not your regular password
3. **Check firewall/network** - Ensure port 587 or 465 is not blocked
4. **Check server logs** - Look for error messages in the console

### Authentication errors

- For Gmail: Make sure 2FA is enabled and you're using an app password
- For other providers: Check if they require special authentication

### Connection errors

- Verify SMTP_HOST and SMTP_PORT are correct for your email provider
- Check if your network allows SMTP connections
- Try using port 465 with `secure: true` for SSL

## Security Notes

- Never commit your `.env` file to version control
- Use app passwords instead of your main account password
- Consider using environment-specific email accounts for production


