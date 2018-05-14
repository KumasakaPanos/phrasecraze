'use script';

import mongoose from 'mongoose';

const scriptSchema = mongoose.Schema({
  title:{
    type: String,
    unique: true,
    required: true,
  },
  content:{
    type: String,
    required: true,
  },
  date:{
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model('script', scriptSchema);
