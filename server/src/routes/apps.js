const express = require('express');
const { body, validationResult } = require('express-validator');
const App = require('../models/App');
const groqService = require('../services/GroqService');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

const router = express.Router();

// @desc    Generate new app
// @route   POST /api/apps/generate
// @access  Public
router.post('/generate', [
  body('prompt', 'Prompt is required').notEmpty().trim(),
  body('framework', 'Framework must be one of: react, vue, vanilla, nextjs').isIn(['react', 'vue', 'vanilla', 'nextjs'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { prompt, framework = 'react' } = req.body;

    // Always use geminiService, which now handles both hardcoded and AI
    const result = await groqService.generateAppCode(prompt, framework);

    // Defensive: Validate files
    if (!result.files || typeof result.files !== 'object' || Object.keys(result.files).length === 0) {
      return res.status(500).json({
        success: false,
        error: 'App generation failed: No files returned.'
      });
    }

    // Use a title: for quick ideas, use the key; for Gemini, use the prompt or a generated title
    let title = result.title;
    if (!title) {
      // Try to infer from prompt (for quick ideas)
      const hardcodedApps = require('../services/hardcodedApps');
      const normalizedPrompt = prompt.toLowerCase();
      const quickKey = Object.keys(hardcodedApps).find(
        key => normalizedPrompt.includes(key.toLowerCase())
      );
      title = quickKey ? quickKey.charAt(0).toUpperCase() + quickKey.slice(1) : prompt;
    }

    // Create the app record
    const app = await App.create({
      title,
      prompt,
      summary: result.summary,
      files: new mongoose.Types.Map(result.files),
      status: 'ready',
      framework
    });

    return res.status(201).json({
      success: true,
      app: {
        id: app._id,
        title: app.title,
        prompt: app.prompt,
        summary: app.summary,
        files: Object.fromEntries(app.files),
        status: app.status,
        framework: app.framework,
        createdAt: app.createdAt
      }
    });
  } catch (error) {
    // Log the error for debugging
    console.error('App generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get all apps
// @route   GET /api/apps
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const apps = await App.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await App.countDocuments({});

    res.json({
      success: true,
      data: apps,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single app
// @route   GET /api/apps/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const app = await App.findById(req.params.id);

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'App not found'
      });
    }

    await app.incrementViews();

    res.json({
      success: true,
      data: app
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update app
// @route   PUT /api/apps/:id
// @access  Public
router.put('/:id', [
  body('title', 'Title is required').notEmpty().trim(),
  body('description', 'Description must be less than 500 characters').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const app = await App.findById(req.params.id);

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'App not found'
      });
    }

    const { title, description, isPublic, tags } = req.body;

    const updatedApp = await App.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        isPublic,
        tags
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedApp
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Improve app code
// @route   POST /api/apps/:id/improve
// @access  Private
router.post('/:id/improve', [
  body('improvementPrompt', 'Improvement prompt is required').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const app = await App.findById(req.params.id);

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'App not found'
      });
    }

    const { improvementPrompt } = req.body;

    // Update status to generating
    app.status = 'generating';
    await app.save();

    // Improve code asynchronously
    groqService.improveCode(app.files, improvementPrompt)
      .then(async (improvedFiles) => {
        try {
          app.files = improvedFiles;
          app.status = 'ready';
          await app.calculateLinesOfCode();
          await app.save();

          logger.info(`App improvement completed for app ${app._id}`);
        } catch (error) {
          logger.error(`Error updating improved app ${app._id}:`, error);
          app.status = 'failed';
          await app.save();
        }
      })
      .catch(async (error) => {
        logger.error(`Code improvement failed for app ${app._id}:`, error);
        app.status = 'failed';
        await app.save();
      });

    res.json({
      success: true,
      message: 'App improvement started',
      app: {
        id: app._id,
        status: app.status
      }
    });

  } catch (error) {
    logger.error('Improve app error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete app
// @route   DELETE /api/apps/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const app = await App.findById(req.params.id);

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'App not found'
      });
    }

    await App.findByIdAndDelete(req.params.id);

    // Update user stats
    await req.user.updateStats('app', -1);

    res.json({
      success: true,
      message: 'App deleted successfully'
    });

  } catch (error) {
    logger.error('Delete app error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get public apps
// @route   GET /api/apps/public
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const apps = await App.find({ isPublic: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await App.countDocuments({ isPublic: true });

    res.json({
      success: true,
      data: apps,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Get public apps error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get app status
// @route   GET /api/apps/:id/status
// @access  Private
router.get('/:id/status', async (req, res) => {
  try {
    const app = await App.findById(req.params.id).select('status');

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'App not found'
      });
    }

    res.json({
      success: true,
      status: app.status
    });

  } catch (error) {
    logger.error('Get app status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router; 