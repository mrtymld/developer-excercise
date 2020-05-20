import { ProductModel, IProduct } from '../models/product.model';
import { Controller, Route, Get, Post, Patch, Body } from 'tsoa';


@Route('/products')
export class ProductController extends Controller {

  @Get()
  public async getAll(): Promise<IProduct[]> {
    try {
      let items: any = await ProductModel.find({});
      items = items.map((item: any) => ({ name: item.name, price: item.price }));
      return items;
    } catch (err) {
      this.setStatus(500);
      console.error('Caught error', err);
    }
  }

  @Post()
  public async create(@Body() product: IProduct): Promise<void> {
    const item = new ProductModel(product);
    await item.save();
    this.setStatus(200);
  }

  @Patch()
  public async createMultiple(@Body() products: IProduct[]): Promise<void> {
    await Promise.race(products.map(async (product) => {
      const item = new ProductModel(product);
      await item.save();
    }))
    this.setStatus(201);
  }
}