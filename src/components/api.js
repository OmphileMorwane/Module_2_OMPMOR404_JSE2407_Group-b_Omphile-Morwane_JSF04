/**
 * Fetches a list of products from the fake store API.
 *
 * @async
 * @function fetchProducts
 * @returns {Promise<Object[]>} A promise that resolves to an array of products.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * try {
 *   const products = await fetchProducts();
 *   console.log(products);
 * } catch (error) {
 *   console.error('Error fetching products:', error);
 * }
 */
export async function fetchProducts() {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return await response.json();
      }
      
      /**
       * Fetches a list of product categories from the fake store API.
       *
       * @async
       * @function fetchCategories
       * @returns {Promise<string[]>} A promise that resolves to an array of category names.
       * @throws {Error} Throws an error if the request fails.
       *
       * @example
       * try {
       *   const categories = await fetchCategories();
       *   console.log(categories);
       * } catch (error) {
       *   console.error('Error fetching categories:', error);
       * }
       */
      
      export async function fetchProduct(id) {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product with id ${id}`);
        }
        const data = await response.json();
        return {
          ...data,
        };
      }
      
      export async function fetchCategories() {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        return await response.json();
      }
      

      /**
 * Authenticates a user using the fake store API.
 *
 * @async
 * @function loginUser
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} A promise that resolves to the authentication response, including the JWT token.
 * @throws {Error} Throws an error if the login request fails.
 *
 * @example
 * try {
 *   const data = await loginUser('username', 'password');
 *   console.log('Token:', data.token);
 * } catch (error) {
 *   console.error('Login failed:', error);
 * }
 */
export async function loginUser(username, password) {
  const response = await fetch('https://fakestoreapi.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return await response.json();
}