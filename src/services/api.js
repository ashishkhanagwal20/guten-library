import axios from "axios";

const API_BASE_URL = 'http://skunkworks.iginitesol.com:8000';

// Function to fetch the books

export const fetchBooks = async ({
  pageParam = null,
  category = '',
  search = '',
}) => {
  try {
    let url = null;
    if (pageParam) {
      const nextPageUrl = new URL(pageParam);
      url = `${API_BASE_URL}${nextPageUrl.pathname}${nextPageUrl.search}`;
    } else {
      url = `${API_BASE_URL}/books`;
    }

    // Params for intital request when app starts
    const config = pageParam
      ? {}
      : {
          params: {
            mime_type: 'image/', //to get only books with covers
            ...(category && { topic: category }),
            ...(search && { search }),
          },
        };
    const response = await axios.get(url, config);
    return {
      results: response.data.results,
      nextPage: response.data.next,
      count: response.data.count,
    };
  } catch (error) {
    console.error('Error fetching books : ', error);
    throw error;
  }
};

export default { fetchBooks };
