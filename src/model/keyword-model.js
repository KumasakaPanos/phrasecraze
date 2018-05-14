'use script';

import mongoose from 'mongoose';

const keywordSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  placement: {
    type: Number,
    required: true,
  },
});

export default mongoose.model('keyword', keywordSchema);