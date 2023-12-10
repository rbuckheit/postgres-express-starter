import { Router, Request, Response, NextFunction } from 'express';

import * as products from '../db/model/products';
import { logger } from '../logger';

const router = Router();

// add new user and return the result
router.post('/add', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`/products/add ${JSON.stringify(req.params)}`);

    const { name, price } = req.body;
    const parsedPrice = parseFloat(price);

    if (Number.isNaN(price)) {
      res.status(400).send('Invalid price: price must be a number');
    } else if (!name) {
      res.status(400).send('Invalid name: name cannot be blank');
    } else {
      const data = await products.add({ name, price: parsedPrice });
      res.status(200).json(data);
    }
  } catch (e) {
    next(e);
  }
});

// find product by userId and productName
router.get(
  '/find/:userId/:name',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price } = req.params;
      const parsedPrice = parseFloat(price);

      const result = await products.find({
        name,
        price: parsedPrice,
      });
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
);

// get all products
router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productsArray = await products.all();
    res.status(200).json(productsArray);
  } catch (e) {
    next(e);
  }
});

export const productsRoute = router;
