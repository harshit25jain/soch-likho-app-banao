const express = require('express');
const { body, validationResult } = require('express-validator');
const App = require('../models/App');
const deploymentService = require('../services/deploymentService');
const logger = require('../utils/logger');

const router = express.Router();

// @desc    Deploy app
// @route   POST /api/deployment/deploy
// @access  Public
router.post('/deploy', [
  body('appId', 'App ID is required').notEmpty(),
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

    const { appId, framework = 'react' } = req.body;

    // Find the app
    const app = await App.findById(appId);

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'App not found'
      });
    }

    // Check if app is ready for deployment
    if (app.status !== 'ready') {
      return res.status(400).json({
        success: false,
        error: 'App is not ready for deployment. Status: ' + app.status
      });
    }

    // Update app status to deploying
    app.status = 'deploying';
    await app.save();

    // Deploy asynchronously
    deploymentService.deployApp(appId, app.files, framework)
      .then(async (deploymentResult) => {
        try {
          // Update app with deployment info
          app.status = 'deployed';
          app.deployUrl = deploymentResult.deployUrl;
          app.deploymentId = deploymentResult.deploymentId;
          await app.incrementDeployments();
          await app.save();

          logger.info(`Deployment completed for app ${appId}: ${deploymentResult.deployUrl}`);
        } catch (error) {
          logger.error(`Error updating deployed app ${appId}:`, error);
          app.status = 'failed';
          await app.save();
        }
      })
      .catch(async (error) => {
        logger.error(`Deployment failed for app ${appId}:`, error);
        app.status = 'failed';
        await app.save();
      });

    res.json({
      success: true,
      message: 'Deployment started',
      app: {
        id: app._id,
        status: app.status
      }
    });

  } catch (error) {
    logger.error('Deploy app error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get deployment status
// @route   GET /api/deployment/:appId/status
// @access  Public
router.get('/:appId/status', async (req, res) => {
  try {
    const app = await App.findById(req.params.appId);

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'App not found'
      });
    }

    // If app has a deployment ID, check Netlify status
    if (app.deploymentId) {
      try {
        const deploymentStatus = await deploymentService.getDeploymentStatus(app.deploymentId);
        
        // Update app status if it has changed
        if (deploymentStatus.status !== app.status) {
          app.status = deploymentStatus.status;
          if (deploymentStatus.url) {
            app.deployUrl = deploymentStatus.url;
          }
          await app.save();
        }

        res.json({
          success: true,
          status: app.status,
          deployUrl: app.deployUrl,
          deploymentId: app.deploymentId
        });
      } catch (error) {
        logger.error('Failed to get deployment status from Netlify:', error);
        // Return current status from database
        res.json({
          success: true,
          status: app.status,
          deployUrl: app.deployUrl,
          deploymentId: app.deploymentId
        });
      }
    } else {
      res.json({
        success: true,
        status: app.status,
        deployUrl: app.deployUrl,
        deploymentId: app.deploymentId
      });
    }

  } catch (error) {
    logger.error('Get deployment status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Redeploy app
// @route   POST /api/deployment/:appId/redeploy
// @access  Public
router.post('/:appId/redeploy', async (req, res) => {
  try {
    const app = await App.findById(req.params.appId);

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'App not found'
      });
    }

    // Check if app is ready for deployment
    if (app.status !== 'ready' && app.status !== 'deployed') {
      return res.status(400).json({
        success: false,
        error: 'App is not ready for redeployment. Status: ' + app.status
      });
    }

    // Update app status to deploying
    app.status = 'deploying';
    await app.save();

    // Redeploy asynchronously
    deploymentService.deployApp(app._id, app.files, app.framework)
      .then(async (deploymentResult) => {
        try {
          // Update app with deployment info
          app.status = 'deployed';
          app.deployUrl = deploymentResult.deployUrl;
          app.deploymentId = deploymentResult.deploymentId;
          await app.incrementDeployments();
          await app.save();

          logger.info(`Redeployment completed for app ${app._id}: ${deploymentResult.deployUrl}`);
        } catch (error) {
          logger.error(`Error updating redeployed app ${app._id}:`, error);
          app.status = 'failed';
          await app.save();
        }
      })
      .catch(async (error) => {
        logger.error(`Redeployment failed for app ${app._id}:`, error);
        app.status = 'failed';
        await app.save();
      });

    res.json({
      success: true,
      message: 'Redeployment started',
      app: {
        id: app._id,
        status: app.status
      }
    });

  } catch (error) {
    logger.error('Redeploy app error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get deployment history
// @route   GET /api/deployment/:appId/history
// @access  Private
router.get('/:appId/history', async (req, res) => {
  try {
    const app = await App.findById(req.params.appId);

    if (!app) {
      return res.status(404).json({
        success: false,
        error: 'App not found'
      });
    }

    // Check if user owns the app
    if (app.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this app'
      });
    }

    // For now, return basic deployment info
    // In a real app, you might want to store deployment history in a separate collection
    const deploymentHistory = {
      totalDeployments: app.analytics.deployments,
      lastDeployment: app.updatedAt,
      currentStatus: app.status,
      deployUrl: app.deployUrl,
      deploymentId: app.deploymentId
    };

    res.json({
      success: true,
      data: deploymentHistory
    });

  } catch (error) {
    logger.error('Get deployment history error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router; 