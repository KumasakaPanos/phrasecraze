'use script';

import mongoose from 'mongoose';

const scriptSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: () => new Date(),
  },
  keywords: {
    type: String,
  },
});

export default mongoose.model('script', scriptSchema);
