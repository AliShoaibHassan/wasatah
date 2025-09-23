import { Router } from 'express';
import { PropertyModel } from '../models/Property.js';

const router = Router();

// GET /api/properties - Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await PropertyModel.findAll();
    res.json({ properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/properties/:id - Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await PropertyModel.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    return res.json({ property });
  } catch (error) {
    console.error('Error fetching property:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch property',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/properties/owner/:ownerId - Get properties by owner
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const properties = await PropertyModel.findByOwner(req.params.ownerId);
    res.json({ properties });
  } catch (error) {
    console.error('Error fetching properties by owner:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/properties - Create new property
router.post('/', async (req, res) => {
  try {
    const property = await PropertyModel.create(req.body);
    res.status(201).json({
      success: true,
      data: property,
      message: 'Property created successfully'
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create property',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/properties/:id - Update property
router.put('/:id', async (req, res) => {
  try {
    const property = await PropertyModel.update(req.params.id, req.body);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    return res.json({
      success: true,
      data: property,
      message: 'Property updated successfully'
    });
  } catch (error) {
    console.error('Error updating property:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update property',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/properties/:id - Delete property
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await PropertyModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    return res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete property',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as propertyRoutes };
