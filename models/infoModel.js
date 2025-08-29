import mongoose from 'mongoose';

const infoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  salary: { type: Number, required: true },
  joiningDate: { type: Date, required: true },
}, {
  timestamps: true,
});

const Info = mongoose.model('Info', infoSchema);

export default Info;
