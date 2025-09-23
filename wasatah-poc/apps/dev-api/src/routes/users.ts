import { Router } from 'express';
import { UserModel } from '../models/User.js';

const router = Router();

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    return res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/users - Create new user
router.post('/', async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await UserModel.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    return res.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await UserModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    return res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as userRoutes };
