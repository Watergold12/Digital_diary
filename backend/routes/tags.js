const express = require('express');
const mongoose = require('mongoose');
const Tag = require('../models/Tag');
const DiaryEntry = require('../models/DiaryEntry');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json(tags.map((t) => t.toJSON()));
  } catch (error) {
    console.error('Get tags error:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// POST /api/tags
router.post('/', async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(422).json({ detail: 'Tag name is required.' });
    }

    // Check for duplicate tag name for this user
    const existing = await Tag.findOne({
      userId: req.user._id,
      name,
    });
    if (existing) {
      return res
        .status(400)
        .json({ detail: 'Tag with this name already exists' });
    }

    const tag = await Tag.create({
      userId: req.user._id,
      name,
      color: color || null,
    });

    return res.status(201).json(tag.toJSON());
  } catch (error) {
    // Handle mongoose unique index error as well
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ detail: 'Tag with this name already exists' });
    }
    console.error('Create tag error:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// PUT /api/tags/:id
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ detail: 'Tag not found' });
    }

    const tag = await Tag.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!tag) {
      return res.status(404).json({ detail: 'Tag not found' });
    }

    const { name, color } = req.body;

    // Check for duplicate name if renaming
    if (name !== undefined && name !== tag.name) {
      const existing = await Tag.findOne({
        userId: req.user._id,
        name,
      });
      if (existing) {
        return res
          .status(400)
          .json({ detail: 'Tag with this name already exists' });
      }
      tag.name = name;
    }

    if (color !== undefined) {
      tag.color = color;
    }

    await tag.save();
    return res.json(tag.toJSON());
  } catch (error) {
    console.error('Update tag error:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// DELETE /api/tags/:id
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ detail: 'Tag not found' });
    }

    const tag = await Tag.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!tag) {
      return res.status(404).json({ detail: 'Tag not found' });
    }

    // Also remove this tag from any diary entries that reference it
    await DiaryEntry.updateMany(
      { tags: req.params.id },
      { $pull: { tags: req.params.id } }
    );

    return res.status(204).send();
  } catch (error) {
    console.error('Delete tag error:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

module.exports = router;
