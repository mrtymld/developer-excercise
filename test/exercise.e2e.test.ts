import * as request from "supertest";
import * as mongoose from 'mongoose';
import { app } from "../src/app";
import { IProduct } from "../src/models/product.model";
import { IOffer } from "../src/models/offer.model";
import mongodb from '../src/config/mongodb.config';


describe("Using the example provided to test the API", () => {

  let db: any;

  beforeAll(async (done) => {
    jest.setTimeout(60000);
    db = await mongodb();
    await mongoose.connect(process.env.MONGODB_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    done();
  });

  afterAll(done => {
    mongoose.connection.close();
    db.stop();
    done()
  })

  it("should be able to register new producst", async done => {

    const data: IProduct[] = [
      {
        name: "apple",
        price: 0.50
      },
      {
        name: "banana",
        price: 0.40
      },
      {
        name: "tomato",
        price: 0.30
      },
      {
        name: "potato",
        price: 0.26
      }
    ]

    const res = await request(app)
      .patch("/products")
      .send(data)

    expect(res.status).toBe(201)
    done()
  })

  it("should be able to create new 'twoForThree' offer", async (done) => {
    const twoForThree: IOffer = {
      products: ["apple", "banana", "tomato"],
      type: "twoForThree"
    }

    const res = await request(app)
      .post("/offers")
      .send(twoForThree)

    expect(res.status).toBe(201)
    done()
  })

  it("should be able to create new 'buyOneGetOneHalfPrice' offer", async (done) => {
    const buyOneGetOneHalfPrice: IOffer = {
      products: ["potato"],
      type: "buyOneGetOneHalfPrice"
    }
    const res = await request(app)
      .post("/offers")
      .send(buyOneGetOneHalfPrice)

    expect(res.status).toBe(201)
    done()
  })

  let basketId: string;

  it("should be able to scan products and add them to a basket", async (done) => {
    const res = await request(app)
      .post("/baskets")
      .send({ products: ["apple", "banana", "banana", "potato", "tomato", "banana", "potato"] })

    expect(res.status).toBe(201)
    expect(typeof (res.body._id)).toBe('string')
    basketId = res.body._id
    done()
  })

  it("should be able to estimate the total price of all scanned products in the basket", async (done) => {
    const res = await request(app)
      .get(`/baskets/${basketId}/total-price`)

    expect(res.status).toEqual(200);
    expect(isNaN(res.body)).toEqual(false); // is a valid number represented as a string
    expect(Number(res.body)).toEqual(1.99);
    done();
  });
});