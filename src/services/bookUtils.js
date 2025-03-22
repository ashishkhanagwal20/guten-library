/**
 * List of categories for the app
 */
export const categories = [
  "Fiction",
  "Philosophy",
  "Drama",
  "History",
  "Humour",
  "Adventure",
  "Politics",
];


/**
 * Gets the best viewable format URL for a book in priority order: HTML > PDF > TXT
 */
export const getViewableBookLink = (book) => {
  if (!book?.formats) return null;

  // Priority order for formats
  const formatPriority = ["text/html", "application/pdf", "text/plain"];

  // Check each format type in order of priority
  for (const formatType of formatPriority) {
    for (const [mime, url] of Object.entries(book.formats)) {
      // Skip zip files (not viewable)
      if (url.endsWith(".zip")) continue;

      // Return the first matching format based on priority
      if (mime.startsWith(formatType)) return url;
    }
  }

  return null; // No viewable format found
};


