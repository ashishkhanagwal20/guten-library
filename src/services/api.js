import axios from "axios";

const API_BASE_URL = "http://skunkworks.ignitesol.com:8000";


export const fetchBooks = async ({
  pageParam = null,
  category = "",
  search = "",
}) => {
  try {
    // Create URL based on whether we're using pagination or making initial request
    const url = pageParam
      ? `${API_BASE_URL}${new URL(pageParam).pathname}${
          new URL(pageParam).search
        }`
      : `${API_BASE_URL}/books`;

    // Set up request configuration - only add params for initial request
    const config = {};

    if (!pageParam) {
      config.params = { mime_type: "image/" }; // Only books with covers

      if (category) config.params.topic = category;
      if (search) config.params.search = search;
    }

    // Make the API request
    const response = await axios.get(url, config);

    // Return formatted response
    return {
      results: response.data.results,
      nextPage: response.data.next,
      count: response.data.count,
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export default { fetchBooks };
