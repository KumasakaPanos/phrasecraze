'use script';

import mongoose from 'mongoose';
import HttpErrors from 'http-errors';
import Script from './script-model';

const keywordSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  placement: {
    type: Number,
    required: true,
  },
  scripts: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    reference: 'scripts',
  },
});

function keywordPreHook(done) { // done is using an (error, data) signature
  // the value of 'contextual this' is the document
  return Script.findById(this.script)
    .then((scriptFound) => {
      if (!scriptFound) {
        throw new HttpErrors(404, 'Script not found');
      }
      scriptFound.books.push(this._id);
      return scriptFound.save();
    })
    .then(() => done()) // done w/o arguements means success
    .catch(done); // done with results means error
} 
const keywordPostHook = (document, done) => {
  return Script.findById(document.script)
    .then((scriptFound) => {
      if (!scriptFound) {
        throw new HttpErrors(500, 'script not found');
      }
      scriptFound.books = scriptFound.books.filter((keyword) => {
        return keyword._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};

keywordSchema.pre('save', keywordPreHook);
keywordSchema.post('remove', keywordPostHook);

export default mongoose.model('keywords', keywordSchema);
