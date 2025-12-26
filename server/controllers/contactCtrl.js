import nodemailer from 'nodemailer'

// POST /api/contact/send
export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body

    // ---------------- VALIDATION ----------------
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      })
    }

    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      })
    }

    const trimmedMessage = message.trim()
    if (trimmedMessage.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters long'
      })
    }

    // ---------------- ENV VARIABLES (SAFE LOAD) ----------------
    const contactEmail =
      process.env.CONTACT_EMAIL || process.env.SMTP_USER

    const smtpHost =
      process.env.SMTP_HOST || 'smtp.gmail.com'

    const smtpPort =
      Number(process.env.SMTP_PORT) || 587

    const smtpUser =
      process.env.SMTP_USER || process.env.CONTACT_EMAIL

    const smtpPass =
      process.env.SMTP_PASS

    // 🔍 DEBUG LOG (TEMPORARY – helps confirm env load)
    console.log('SMTP CHECK:', {
      contactEmail,
      smtpHost,
      smtpPort,
      hasUser: !!smtpUser,
      hasPass: !!smtpPass
    })

    // ---------------- FINAL CHECK ----------------
    if (!contactEmail || !smtpUser || !smtpPass) {
      return res.status(500).json({
        success: false,
        message:
          'Email configuration is missing. Please check SMTP environment variables.'
      })
    }

    // ---------------- TRANSPORTER ----------------
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    })

    // ---------------- EMAIL ----------------
    await transporter.sendMail({
      from: `"${name}" <${smtpUser}>`,
      to: contactEmail,
      replyTo: email,
      subject: `Contact Form Message from ${name}`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br/>${trimmedMessage}</p>
      `
    })

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    })

  } catch (error) {
    console.error('Contact Email Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to send message'
    })
  }
}
