import mongoose from 'mongoose'

const { Schema } = mongoose

const bookedVisitSchema = new Schema(
  {
    residency: { type: Schema.Types.ObjectId, ref: 'Residency' },
    date: { type: Date },
    status: { 
      type: String, 
      enum: ['confirmed', 'cancelled', 'modified'], 
      default: 'confirmed' 
    },
    bookingDate: { type: Date, default: Date.now }, // When booking was created
    modificationHistory: [{
      previousDate: Date,
      newDate: Date,
      modifiedAt: Date,
      charge: { type: Number, default: 0 }
    }],
    cancellationDate: { type: Date },
    cancellationCharge: { type: Number, default: 0 }
  },
  { _id: true, timestamps: true }
)

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    password: { type: String, minlength: 8 },
    googleId: { type: String },
    image: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isBlocked: { type: Boolean, default: false },
    bookedVisits: { type: [bookedVisitSchema], default: [] },
    favResidenciesID: { type: [Schema.Types.ObjectId], ref: 'Residency', default: [] },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
)

// Hide sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.passwordResetToken
  delete obj.passwordResetExpires
  return obj
}

export default mongoose.model('User', userSchema)
