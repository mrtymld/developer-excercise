import { OfferModel, IOffer } from '../models/offer.model';
import { Controller, Route, Get, Post, Body } from 'tsoa';


@Route('/offers')
export class OfferController extends Controller {
  
  @Get()
  public async getAll(): Promise<IOffer[]> {
    try {
      let items: any = await OfferModel.find({});
      items = items.map((item: any) => { return { id: item._id, description: item.description } });
      return items;
    } catch (err) {
      this.setStatus(500);
      console.error('Caught error', err);
    }
  }

  @Post()
  public async create(@Body() offer: IOffer): Promise<void> {
    const item = new OfferModel(offer);
    await item.save();
    this.setStatus(201);
  }
}