import * as mongoose from 'mongoose';

interface IProduct {
  name: string;
  price: number;
}

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    dropDups: true
  },
  price: Number
})

const ProductModel = mongoose.model('Product', ProductSchema);

export { ProductModel, IProduct };