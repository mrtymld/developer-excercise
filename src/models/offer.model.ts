import * as mongoose from 'mongoose';

interface IOffer {
  products: string[];
  type: string;
}

const OfferSchema = new mongoose.Schema({
  products: [String],
  type: {
    type: String,
    enum: ['twoForThree', 'buyOneGetOneHalfPrice'],
  }
})

const OfferModel = mongoose.model('Offer', OfferSchema);

export { OfferModel, IOffer };