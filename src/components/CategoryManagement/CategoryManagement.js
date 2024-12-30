import React, { useState, useEffect } from 'react';
import { 
  fetchMainCategories, 
  fetchSubCategories, 
  createCategory, 
  deleteCategory 
} from '../../api/storeapi';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedMain, setSelectedMain] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const mainResponse = await fetchMainCategories();
      const subResponse = await fetchSubCategories();
      setMainCategories(mainResponse.data);
      setSubCategories(subResponse.data);
      console.log(mainResponse.data);
      console.log(subResponse.data);
    } catch (error) {
      setError('Failed to load categories');
    }
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (!selectedMain || !newSubCategory.trim() || !selectedImage) {
      setError('Please select a main category, enter a subcategory name, and upload an image');
      return;
    }

    try {
      // Format image name
      const formattedName = newSubCategory.trim().toLowerCase().replace(/\s+/g, '-');
      const fileExtension = selectedImage.name.split('.').pop();
      const formattedImageName = `${formattedName}.${fileExtension}`;

      // Create FormData
      const formData = new FormData();
      formData.append('name', newSubCategory.trim());
      formData.append('parentCategoryID', selectedMain);
      formData.append('description', description.trim());
      formData.append('image', selectedImage, formattedImageName);

      await createCategory(formData);
      
      setSuccess('Subcategory added successfully');
      setNewSubCategory('');
      setDescription('');
      setSelectedImage(null);
      loadCategories();
    } catch (error) {
      setError('Failed to add subcategory');
    }
  };

  const handleDeleteSubCategory = async (id) => {
    try {
      await deleteCategory(id);
      setSuccess('Subcategory deleted successfully');
      loadCategories();
    } catch (error) {
      setError('Failed to delete subcategory');
    }
  };

  return (
    <div className="category-management">
      
      <div className="category-controls">
        <button 
          className="add-category-button" 
          onClick={() => setIsAddingCategory(!isAddingCategory)}
        >
          {isAddingCategory ? 'Cancel' : 'Add New Category'}
        </button>
      </div>

      {isAddingCategory && (
        <div className="add-category-form">
          <h3>Add New Category</h3>
          <form onSubmit={handleAddSubCategory}>
            <div className="form-inputs">
              <select 
                value={selectedMain} 
                onChange={(e) => setSelectedMain(e.target.value)}
                required
              >
                <option value="">Select Main Category</option>
                {mainCategories.map(category => (
                  <option key={category.categoryID} value={category.categoryID}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <input
                type="text"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                placeholder="Name"
                required
              />

              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                required
              />
            </div>
            
            <button type="submit">Add Category</button>
          </form>
        </div>
      )}

      <div className="categories-display">
        <h3>Current Categories</h3>
        {mainCategories.map(main => (
          <div key={main.categoryID} className="category-group">
            <h4>{main.name}</h4>
            <div className="subcategories">
              {subCategories
                .filter(sub => sub.parentCategoryID === main.categoryID)
                .map(sub => (
                  <div key={sub.categoryID} className="subcategory-item">
                    <span>{sub.name}</span>
                    <button 
                      onClick={() => handleDeleteSubCategory(sub.categoryID)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default CategoryManagement;