import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:category" element={<BooksPage />} />
      </Routes>
    </Router>
  );
}

export default App;
