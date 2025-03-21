import React from 'react'
import { useNavigate } from 'react-router-dom'
import { categories } from '../services/bookutils';
import "../styles/HomePage.css"

const HomePage = () => {
    const navigate = useNavigate();
    // Navigate to books page for selected category
    const handleCategoryClick=(category)=>{
        navigate(`/books/${encodeURIComponent(category)}`)
    };
  return (
    <div className='home-container'>
        <h1 className="app-title">Guten Library</h1>
        <div className="categories-container">
            {categories.map(category=>(
                <button className="category-button" key={category} onClick={()=>handleCategoryClick(category)}>
<div className={`category-icon ${category.toLowerCase()}-icon`}></div>
{category}
                </button>
            ))}
        </div>
      
    </div>
  )
}

export default HomePage
