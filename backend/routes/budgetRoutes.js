// backend/routes/budgetRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createBudget, 
  getBudgets, 
  getBudgetById,
  updateBudget, 
  deleteBudget,
  getBudgetSummary
} = require('../controllers/budgetController.js');
const { protect } = require('../middleware/authMiddleware');

// ✅ All routes are protected (DRY principle - apply once)
router.use(protect);

// ✅ Group related routes with proper HTTP methods
router.route('/')
  .post(createBudget)      // Create a new budget
  .get(getBudgets);        // Get all budgets

router.route('/summary')
  .get(getBudgetSummary);  // Get budget summary/stats

router.route('/:id')
  .get(getBudgetById)      // Get single budget
  .put(updateBudget)       // Update budget
  .delete(deleteBudget);   // Delete budget

module.exports = router;