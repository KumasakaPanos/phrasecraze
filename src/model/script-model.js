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
  keywords: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'keywords', 
    },
  ],
});

export default mongoose.model('scripts', scriptSchema);
