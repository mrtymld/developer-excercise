import { BasketModel, IBasket } from '../models/basket.model';
import { Controller, Route, Get, Post, Path, Body } from 'tsoa';
import { ProductModel } from '../models/product.model';
import { OfferModel } from '../models/offer.model';


@Route('/baskets')
export class BasketController extends Controller {

  @Get()
  public async getAll(): Promise<IBasket[]> {
    try {
      let items: any = await BasketModel.find({});
      items = items.map((item: any) => { return { id: item._id, description: item.description } });
      return items;
    } catch (err) {
      this.setStatus(500);
      console.error('Caught error', err);
    }
  }

  @Post()
  public async create(@Body() basket: IBasket): Promise<object> {
    const item = new BasketModel(basket);
    await item.save();
    this.setStatus(201);
    return { _id: item._id };
  }

  @Get('{id}/total-price')
  public async getTotalPrice(@Path('id') basketId: string): Promise<number> {
    try {

      let basket: any = await BasketModel.findById(basketId);
      let uniqueItemsInBasket = Array.from(new Set(basket.products));
      let products: any = await ProductModel.find().where('name').in(uniqueItemsInBasket);
      let twoForThreeOffer: any = await OfferModel.findOne({ type: "twoForThree" });
      let buyOneGetOneHalfPriceOffer: any = await OfferModel.findOne({ type: "buyOneGetOneHalfPrice" });
      let thereWasbuyOneGetOneHalfPriceOfferProduct = false;
      let scannedProducts = [];

      const totalPrice = basket.products
        .map((productName: string) => {
          const product = products.find((product: any) => productName == product.name);
          let productPrice = product.price;

          // buyOneGetOneHalfPriceOffer
          if (buyOneGetOneHalfPriceOffer.products.includes(product.name)) {
            if (thereWasbuyOneGetOneHalfPriceOfferProduct) {
              // deduct price with half
              productPrice /= 2;
              thereWasbuyOneGetOneHalfPriceOfferProduct = false;
            } else {
              thereWasbuyOneGetOneHalfPriceOfferProduct = true;
            }
          }

          scannedProducts.push(product);

          // twoForThreeOffer
          if (scannedProducts.length >= 3) {
            let lastThreeProductsScanned = scannedProducts.slice(-3);
            let lastThreeAreDeal = lastThreeProductsScanned.every(product => twoForThreeOffer.products.includes(product.name));
            if (lastThreeAreDeal) {
              let cheapestProduct = lastThreeProductsScanned[0];
              for (let i = 1; i < lastThreeProductsScanned.length; i++) {
                if (cheapestProduct.price > lastThreeProductsScanned[i].price) {
                  cheapestProduct = lastThreeProductsScanned[i];
                }
              }
              // deduct cheapest item
              productPrice -= cheapestProduct.price;
              scannedProducts = [];
            }
          }

          return productPrice;
        })
        .reduce((a: number, b: number) => a + b);

      this.setStatus(200);
      return totalPrice.toFixed(2);
    } catch (err) {
      this.setStatus(500);
      console.error('Caught error', err);
    }
  }
}