import { useNavigate } from 'react-router-dom';
import { categories } from '../services/bookUtils';
import '../styles/HomePage.css';

// Import category icons
import fictionIcon from '../assets/New Assets/Fiction.svg';
import dramaIcon from '../assets/New Assets/Drama.svg';
import humourIcon from '../assets/New Assets/Humour.svg';
import politicsIcon from '../assets/New Assets/Politics.svg';
import philosophyIcon from '../assets/New Assets/Philosophy.svg';
import historyIcon from '../assets/New Assets/History.svg';
import adventureIcon from '../assets/New Assets/Adventure.svg';

const HomePage = () => {
  const navigate = useNavigate();

  // Map category names to their icons
  const categoryIcons = {
    'Fiction': fictionIcon,
    'Drama': dramaIcon,
    'Humour': humourIcon,
    'Politics': politicsIcon,
    'Philosophy': philosophyIcon,
    'History': historyIcon,
    'Adventure': adventureIcon
  };

  // Navigate to books page for the selected category
  const handleCategoryClick = (category) => {
    navigate(`/books/${encodeURIComponent(category)}`);
  };

  return (
    <div className="home-container">
      <h1 className="app-title">Gutenberg Project</h1>
      <p className="app-description">
        A social cataloging website that allows you to freely search its database of books, annotations, and reviews.
      </p>
      <div className="categories-container">
        {categories.map((category) => (
          <button
            key={category}
            className="category-button"
            onClick={() => handleCategoryClick(category)}
          >
            <div className="category-text">
              <img src={categoryIcons[category]} alt={category} className="category-icon" />
              {category}
            </div>
            <div className="category-arrow"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage; 