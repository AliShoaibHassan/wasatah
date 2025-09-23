import { Router } from 'express';
import { OfferModel } from '../models/Offer.js';

const router = Router();

// GET /api/offers - Get all offers
router.get('/', async (req, res) => {
  try {
    const offers = await OfferModel.findAll();
    res.json({ offers });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch offers',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/offers/:id - Get offer by ID
router.get('/:id', async (req, res) => {
  try {
    const offer = await OfferModel.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found'
      });
    }
    return res.json({ offer });
  } catch (error) {
    console.error('Error fetching offer:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch offer',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/offers/property/:propertyId - Get offers by property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const offers = await OfferModel.findByProperty(req.params.propertyId);
    res.json({ offers });
  } catch (error) {
    console.error('Error fetching offers by property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch offers',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/offers/buyer/:buyerId - Get offers by buyer
router.get('/buyer/:buyerId', async (req, res) => {
  try {
    const offers = await OfferModel.findByBuyer(req.params.buyerId);
    res.json({ offers });
  } catch (error) {
    console.error('Error fetching offers by buyer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch offers',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/offers/seller/:sellerId - Get offers by seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const offers = await OfferModel.findBySeller(req.params.sellerId);
    res.json({ offers });
  } catch (error) {
    console.error('Error fetching offers by seller:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch offers',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/offers - Create new offer
router.post('/', async (req, res) => {
  try {
    const offer = await OfferModel.create(req.body);
    res.status(201).json({
      success: true,
      data: offer,
      message: 'Offer created successfully'
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create offer',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/offers/:id - Update offer
router.put('/:id', async (req, res) => {
  try {
    const offer = await OfferModel.update(req.params.id, req.body);
    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found'
      });
    }
    return res.json({
      success: true,
      data: offer,
      message: 'Offer updated successfully'
    });
  } catch (error) {
    console.error('Error updating offer:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update offer',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/offers/:id - Delete offer
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await OfferModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found'
      });
    }
    return res.json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete offer',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as offerRoutes };
