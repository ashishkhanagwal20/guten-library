import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchBooks } from '../services/api';
import { getViewableBookLink } from '../services/bookutils';
import LoadingSpinner from '../components/LoadingSpinner';

const BooksPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  //Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  //pagination and data fetch by react-qury
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
    queryFn: ({ pageParam }) =>
      fetchBooks({ pageParam, category, search: debouncedSearchTerm }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
  });

  //   scroll for infinite loading
  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const scrolledToBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 400;

    if (scrolledToBottom) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Event listener for scroll evet
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Open book in new page
  const handleBookClick = (book) => {
    const bookLink = getViewableBookLink(book);

    if (bookLink) {
      window.open(bookLink, '_blank');
    } else {
      alert('No Viewable version available');
    }
  };

  const allBooks = data?.pages.flatMap((page) => page.results) || [];
  console.log('All Books : ', allBooks);

  return (
    <div className="books-page">
      <div className="header">
        <button className="back-button" onClick={() => navigate('/')}>
          Back
        </button>
        <h1>{category} Books</h1>
        <div className="search-container">
          <span className="search-icon"></span>
          <input
            type="text"
            className="search-input"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {error && (
        <div className="error-message">
            Failed to fetch books. try again.
            <button className="retry-button" onClick={()=>refetch()}>Retry</button>
        </div>
      )}

      {status === 'pending' && <LoadingSpinner size={60}/>}

      {status === "pending" && (
    <>
    <div className="books-grid">
        {allBooks.map(book=>(
            <div className="book-card" key={book.id} onClick={()=>handleBookClick(book)}>
                {book.formats['image/jpeg'] && (
                    <img src={book.formats['image/jpeg']} alt={book.title} className="book-cover" />
                )}
                <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">{book.authors.map(author=>author.name).join(", ")}</p>
                </div>
            </div>
        ))}
    </div>
    {isFetchingNextPage && <LoadingSpinner/>}
    {hasNextPage && !isFetchingNextPage && (
        <div className="load-more-containers">
            <button className="load-more-button" onClick={fetchNextPage}>Load More Books</button>
        </div>
    )}
    {!hasNextPage && allBooks.length > 0 && (
        <div className="end-message">End of results</div>
    )}
    {status === "success" && allBooks.length === 0 && (
        <div className="no-books">No books found for this query</div>
    )}
    </>
      )}
    </div>
  );
};

export default BooksPage;
