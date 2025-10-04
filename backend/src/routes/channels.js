const express = require('express');
const Channel = require('../models/Channel');

const router = express.Router();

// Get all channels
router.get('/', async (req, res) => {
  try {
    const channels = await Channel.getAll();
    res.json({ channels });
  } catch (error) {
    console.error('Get channels error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get channel by ID
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    res.json({ channel });
  } catch (error) {
    console.error('Get channel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create channel
router.post('/', async (req, res) => {
  try {
    const { name, description, created_by, is_private } = req.body;

    if (!name || !created_by) {
      return res.status(400).json({ error: 'Name and created_by are required' });
    }

    const channel = await Channel.create({
      name,
      description,
      created_by,
      is_private
    });

    res.status(201).json({
      message: 'Channel created successfully',
      channel
    });
  } catch (error) {
    console.error('Create channel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get channel members
router.get('/:id/members', async (req, res) => {
  try {
    const members = await Channel.getMembers(req.params.id);
    res.json({ members });
  } catch (error) {
    console.error('Get channel members error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add member to channel
router.post('/:id/members', async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    await Channel.addMember(req.params.id, user_id);

    res.json({
      message: 'User added to channel successfully'
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;