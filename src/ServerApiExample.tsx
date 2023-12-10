import React from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import './ServerApiExample.scss';

interface FormData {
  name: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

function ServerApiExample() {
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    price: 0,
  });

  const [addedProduct, setAddedProduct] = React.useState<Product | null>(null);
  const [addProductError, setAddProductError] =
    React.useState<AxiosError | null>(null);

  const [userList, setUserList] = React.useState<Array<Product>>([]);
  const [userListError, setUserListError] = React.useState<AxiosError | null>(
    null
  );

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setAddProductError(null);
    setAddedProduct(null);

    axios
      .post('/api/products/add', formData)
      .then((response: AxiosResponse<Product>) => {
        setAddedProduct(response.data);
      })
      .catch((error: AxiosError) => {
        setAddProductError(error);
      });
  }

  function loadProducts(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    setUserList([]);
    setUserListError(null);

    axios
      .get('/api/products/all')
      .then((response: AxiosResponse<Array<Product>>) => {
        setUserList(response.data);
        setUserListError(null);
      })
      .catch((error: AxiosError) => {
        setUserListError(error);
      });
  }

  const renderServerReponse = (response: object) => {
    return (
      <div className="server_response">
        <b>Server Response</b>
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </div>
    );
  };

  const renderServerError = (error: AxiosError) => {
    return (
      <div className="server_response server_error">
        <b>Server Error</b>
        <pre>
          {error.message}
          {error.response ? `\n${error.response.data}` : ''}
        </pre>
      </div>
    );
  };

  return (
    <div className="server_api_example">
      <h3>Make a server call</h3>

      <div className="section">
        <h4>/api/products/add</h4>

        <form onSubmit={handleSubmit} className="create_product_form">
          <label htmlFor="name">
            Name <br />
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </label>

          <label htmlFor="price">
            Price <br />
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Create Product</button>
        </form>

        {addedProduct && renderServerReponse(addedProduct)}
        {addProductError && renderServerError(addProductError)}
      </div>

      <div className="section">
        <h4>/api/products/all</h4>

        <div className="load_products">
          <button type="button" onClick={loadProducts}>
            Load All Products
          </button>
        </div>

        {userList.length > 0 && renderServerReponse(userList)}
        {userListError && renderServerError(userListError)}
      </div>
    </div>
  );
}

export default ServerApiExample;
