import { db } from '..';

interface ProductRow {
  id: number;
  name: string;
  price: number;
}

export const add = async ({
  name,
  price,
}: {
  name: string;
  price: number;
}): Promise<ProductRow> => {
  const insertQuery = `
    INSERT INTO products(name, price)
    VALUES($1, $2)
    RETURNING *;
  `;

  return db.one(insertQuery, [name, price]);
};

export const remove = async (id: number | string) => {
  const deleteQuery = `
    DELETE FROM products
    WHERE id = $1
  `;

  return db.result(deleteQuery, [id]);
};

export const find = async ({
  name,
  price,
}: {
  name: string;
  price: number;
}): Promise<ProductRow | null> => {
  const findQuery = `
    SELECT * FROM products
    WHERE name = $1
    AND price = $2
  `;

  return db.oneOrNone(findQuery, [name, price]);
};

export const all = async (): Promise<Array<ProductRow>> =>
  db.any('SELECT * FROM products');

export const total = async (): Promise<number> =>
  db.one('SELECT count(*) FROM products', [], (a) => a.count);
