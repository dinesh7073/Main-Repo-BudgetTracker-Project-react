import React, { useState } from 'react';
import { Input, Button, message } from 'antd';

const CategoriesCompo = () => {
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {

      setNewCategory(''); 
      message.success('Category added successfully!');
    } else {
      message.error('Please enter a valid category name.');
    }
  };

  return (
    <div>
      <h2>Categories Component</h2>
      <Input
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="Add a new category"
      />
      <Button type="primary" onClick={handleAddCategory}>Add Category</Button>
    </div>
  );
}

export default CategoriesCompo;
