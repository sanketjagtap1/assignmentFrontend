'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './Products.module.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login'); 
        return;
      }

      try {
        const { data } = await axios.get(`http://localhost:4000/api/products?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError('Failed to load products');
      }
    };

    fetchProducts();
  }, [currentPage, router]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h1 className={styles.title}>Products</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {products.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <button onClick={handlePreviousPage} disabled={currentPage === 1} className={styles.pageButton}>
              Previous
            </button>
            <span> Page {currentPage} of {totalPages} </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className={styles.pageButton}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>Loading products...</p>
      )}
    </div>
  );
}
