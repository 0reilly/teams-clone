const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// Get messages for channel
router.get('/channel/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await Message.getByChannel(channelId, parseInt(limit), parseInt(offset));
    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create message
router.post('/', async (req, res) => {
  try {
    const { content, channel_id, user_id, message_type, file_url } = req.body;

    if (!content || !channel_id || !user_id) {
      return res.status(400).json({ error: 'Content, channel_id, and user_id are required' });
    }

    const message = await Message.create({
      content,
      channel_id,
      user_id,
      message_type,
      file_url
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete message
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const deleted = await Message.delete(id, user_id);

    if (!deleted) {
      return res.status(404).json({ error: 'Message not found or unauthorized' });
    }

    res.json({
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;