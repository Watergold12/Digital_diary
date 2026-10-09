const express = require('express');
const mongoose = require('mongoose');
const DiaryEntry = require('../models/DiaryEntry');
const Tag = require('../models/Tag');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/entries
router.get('/', async (req, res) => {
  try {
    const { q, tag_id } = req.query;
    const filter = { userId: req.user._id };

    // If filtering by tag_id, add to filter
    if (tag_id) {
      if (!mongoose.Types.ObjectId.isValid(tag_id)) {
        return res.json([]);
      }
      filter.tags = tag_id;
    }

    let entries;

    if (q) {
      // Build text search: search title, content, and tag names
      const searchPattern = new RegExp(q, 'i');

      // Find tags that match the search query for this user
      const matchingTags = await Tag.find({
        userId: req.user._id,
        name: searchPattern,
      }).select('_id');

      const matchingTagIds = matchingTags.map((t) => t._id);

      // Search entries by title, content, or matching tags
      const searchFilter = {
        ...filter,
        $or: [
          { title: searchPattern },
          { content: searchPattern },
          ...(matchingTagIds.length > 0
            ? [{ tags: { $in: matchingTagIds } }]
            : []),
        ],
      };

      entries = await DiaryEntry.find(searchFilter)
        .populate('tags')
        .sort({ createdAt: -1 });
    } else {
      entries = await DiaryEntry.find(filter)
        .populate('tags')
        .sort({ createdAt: -1 });
    }

    return res.json(entries.map((e) => e.toJSON()));
  } catch (error) {
    console.error('Get entries error:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// POST /api/entries
router.post('/', async (req, res) => {
  try {
    const { title, content, mood, tag_ids } = req.body;

    if (!title || !content) {
      return res.status(422).json({ detail: 'Title and content are required.' });
    }

    const entryData = {
      userId: req.user._id,
      title,
      content,
      mood: mood || null,
      tags: [],
    };

    // Validate and attach tags
    if (tag_ids && tag_ids.length > 0) {
      const validTags = await Tag.find({
        _id: { $in: tag_ids },
        userId: req.user._id,
      });
      entryData.tags = validTags.map((t) => t._id);
    }

    const entry = await DiaryEntry.create(entryData);
    const populated = await entry.populate('tags');

    return res.status(201).json(populated.toJSON());
  } catch (error) {
    console.error('Create entry error:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// GET /api/entries/:id
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ detail: 'Entry not found' });
    }

    const entry = await DiaryEntry.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('tags');

    if (!entry) {
      return res.status(404).json({ detail: 'Entry not found' });
    }

    return res.json(entry.toJSON());
  } catch (error) {
    console.error('Get entry error:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// PUT /api/entries/:id
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ detail: 'Entry not found' });
    }

    const entry = await DiaryEntry.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ detail: 'Entry not found' });
    }

    const { title, content, mood, tag_ids } = req.body;

    if (title !== undefined) entry.title = title;
    if (content !== undefined) entry.content = content;
    if (mood !== undefined) entry.mood = mood;

    if (tag_ids !== undefined) {
      const validTags = await Tag.find({
        _id: { $in: tag_ids },
        userId: req.user._id,
      });
      entry.tags = validTags.map((t) => t._id);
    }

    await entry.save();
    const populated = await entry.populate('tags');

    return res.json(populated.toJSON());
  } catch (error) {
    console.error('Update entry error:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// DELETE /api/entries/:id
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ detail: 'Entry not found' });
    }

    const entry = await DiaryEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ detail: 'Entry not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Delete entry error:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

module.exports = router;
