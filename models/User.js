import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  personal: {
    name: String,
    phone: String,
    email: String,
    age: Number,
    gender: String,
    state: String,
    district: String
  },
  household: {
    isHead: String,
    familyType: String,
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
  goals: [String]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
