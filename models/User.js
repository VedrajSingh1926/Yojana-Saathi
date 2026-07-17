import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  saathiId: { type: String, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  email: { type: String },
  state: { type: String },
  district: { type: String },
  household: {
    headName: { type: String },
    totalMembers: { type: Number },
    annualIncome: { type: Number },
    members: [{
      name: String,
      age: Number,
      gender: String,
      relation: String,
      occupation: String,
      education: String,
      income: Number,
      marital: String,
      disability: String
    }]
  },
  details: {
    houseType: String,
    area: String,
    category: String,
    farmer: String,
    bpl: String,
    bank: String,
    land: String
  },
  goals: [String],
  documents: [{
    name: String,
    verified: { type: Boolean, default: false }
  }],
  createdAtIST: { type: String, default: () => new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
