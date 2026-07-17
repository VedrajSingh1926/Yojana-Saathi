import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true }, // e.g. 'Aadhaar', 'PAN', 'Income Certificate'
  originalName: { type: String, required: true },
  status: { type: String, default: 'Uploaded' }, // e.g. 'Verified', 'Pending Verification'
  uploadDate: { type: Date, default: Date.now },
  expiryDate: { type: Date }
});

const Document = mongoose.model('Document', documentSchema);
export default Document;
