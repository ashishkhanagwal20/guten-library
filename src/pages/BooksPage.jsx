import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getViewableBookLink } from '../services/bookUtils';
import { fetchBooks } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/BooksPage.css';

const BooksPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Fetch books with React Query's infinite query
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['books', category, debouncedSearchTerm],
    queryFn: ({ pageParam }) => fetchBooks({ pageParam, category, search: debouncedSearchTerm }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
  });
  
  // Handle scroll for infinite loading
  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    
    const scrolledToBottom = 
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 400;
      
    if (scrolledToBottom) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  
  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  // Handle book click to open in browser
  const handleBookClick = (book) => {
    const bookLink = getViewableBookLink(book);
    
    if (bookLink) {
      window.open(bookLink, '_blank');
    } else {
      alert('No viewable version available');
    }
  };
  
  // Clear search term
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  // Get all books from all loaded pages
  const allBooks = data?.pages.flatMap(page => page.results) || [];
  
  return (
    <div className="books-page">
      <div className="header">
        <div className="header-top">
          <button className="back-button" onClick={() => navigate('/')} aria-label="Go back">
          </button>
          <h1>{category}</h1>
        </div>
        <div className="search-container">
          <span className="search-icon"></span>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-button" 
              onClick={clearSearch}
              aria-label="Clear search"
            ></button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          Failed to fetch books. Please try again.
          <button onClick={() => refetch()} className="retry-button">Retry</button>
        </div>
      )}
      
      {status === 'pending' ? (
        <LoadingSpinner size={60} />
      ) : (
        <>
          <div className="books-grid-container">
            <div className="books-grid">
              {allBooks.map((book) => (
                <div
                  key={book.id}
                  className="book-card"
                  onClick={() => handleBookClick(book)}
                >
                  {book.formats['image/jpeg'] && (
                    <img 
                      src={book.formats['image/jpeg']} 
                      alt={book.title} 
                      className="book-cover" 
                    />
                  )}
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">
                      {book.authors.map(author => author.name).join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {isFetchingNextPage && <LoadingSpinner />}
          
          {hasNextPage && !isFetchingNextPage && (
            <div className="load-more-container">
              <button className="load-more-button" onClick={fetchNextPage}>
                Load More Books
              </button>
            </div>
          )}
          
          {!hasNextPage && allBooks.length > 0 && (
            <div className="end-message">End of results</div>
          )}
          
          {status === 'success' && allBooks.length === 0 && (
            <div className="no-books">No books found matching your search</div>
          )}
        </>
      )}
    </div>
  );
};

export default BooksPage; 