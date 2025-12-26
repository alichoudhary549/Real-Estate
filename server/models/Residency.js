import mongoose from 'mongoose'

const { Schema } = mongoose

const residencySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    address: { type: String, required: true },
    city: { type: String },
    country: { type: String },
    image: { type: String },
    facilities: { type: Schema.Types.Mixed },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
)

// Unique index on (address, owner) to prevent duplicate residencies per owner
residencySchema.index({ address: 1, owner: 1 }, { unique: true })

export default mongoose.model('Residency', residencySchema)
