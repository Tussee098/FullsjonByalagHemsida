// routes/categoriesRoutes.js
import express from 'express';
import NavBarCategory from '../models/NavBarCategory.js'; // Assuming this model exists
import NavBarOption from '../models/NavBarOption.js'; // Assuming this model exists
import authorization from '../middleware/authorization.js';

const router = express.Router();

// GET all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await NavBarCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST a new category
router.post('/categories', authorization, async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = new NavBarCategory({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

// DELETE a category and its options
router.delete('/categories/:id', authorization, async (req, res) => {
  const categoryId = req.params.id;
  try {
    const deletedCategory = await NavBarCategory.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Delete all options related to this category
    await NavBarOption.deleteMany({ categoryId });
    res.status(200).json({ message: 'Category and its options deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// GET all options for a category by name
router.get('/options/:name', async (req, res) => {
  const { optionName } = req.params;
  try {

    const options = await NavBarOption.find(optionName);
    res.status(200).json(options);
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({ error: 'Failed to fetch options' });
  }
});

// GET all options for a category by category ID
router.get('/options', async (req, res) => {
  try {
    
    const options = await NavBarOption.find();
    res.status(200).json(options);
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({ error: 'Failed to fetch options' });
  }
});

// GET all options for a category by category ID
router.get('/options/id/:categoryId', async (req, res) => {
 
  const { categoryId } = req.params;
  try {
    const options = await NavBarOption.find({categoryId: categoryId });
    res.status(200).json(options);
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({ error: 'Failed to fetch options' });
  }
});

// POST a new option under a category
router.post('/options', authorization, async (req, res) => {
  const { name, categoryId, path} = req.body;
  try {
    const newOption = new NavBarOption({ name, categoryId, path});
    await newOption.save();
    res.status(201).json(newOption);
  } catch (error) {
    console.error('Error adding option:', error);
    res.status(500).json({ error: 'Failed to add option' });
  }
});

// DELETE an option
router.delete('/options/:id', authorization, async (req, res) => {
  const optionId = req.params.id;
  try {
    const deletedOption = await NavBarOption.findByIdAndDelete(optionId);
    if (!deletedOption) {
      return res.status(404).json({ message: 'Option not found' });
    }
    res.status(200).json({ message: 'Option deleted' });
  } catch (error) {
    console.error('Error deleting option:', error);
    res.status(500).json({ error: 'Failed to delete option' });
  }
});

export default router;
