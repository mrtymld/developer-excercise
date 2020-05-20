import * as mongoose from 'mongoose';

interface IBasket {
  products: string[];
}

const BasketSchema = new mongoose.Schema({
  products: [String]
})

const BasketModel = mongoose.model('Basket', BasketSchema);

export { BasketModel, IBasket };