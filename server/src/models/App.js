const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  prompt: {
    type: String,
    required: [true, 'Please add a prompt'],
    trim: true
  },
  summary: {
    type: String,
    required: [true, 'Please add a summary'],
    trim: true
  },
  files: {
    type: Map,
    of: String,
    required: [true, 'Please add files'],
  },
  status: {
    type: String,
    enum: ['generating', 'ready', 'deploying', 'deployed', 'failed'],
    default: 'generating'
  },
  deployUrl: {
    type: String,
    default: ''
  },
  deploymentId: {
    type: String,
    default: ''
  },
  framework: {
    type: String,
    enum: ['react', 'vue', 'vanilla', 'nextjs'],
    default: 'react'
  },
  features: [{
    type: String,
    enum: ['dark-mode', 'responsive', 'animations', 'pwa', 'typescript', 'tailwind']
  }],
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    linesOfCode: {
      type: Number,
      default: 0
    },
    fileCount: {
      type: Number,
      default: 0
    },
    dependencies: [{
      name: String,
      version: String
    }],
    buildTime: {
      type: Number,
      default: 0
    }
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    deployments: {
      type: Number,
      default: 0
    },
    lastViewed: {
      type: Date,
      default: Date.now
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  thumbnail: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better query performance
appSchema.index({ user: 1, createdAt: -1 });
appSchema.index({ status: 1 });
appSchema.index({ isPublic: 1, createdAt: -1 });
appSchema.index({ tags: 1 });

// Virtual for formatted creation date
appSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Method to update analytics
appSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  this.analytics.lastViewed = new Date();
  return this.save();
};

appSchema.methods.incrementDeployments = function() {
  this.analytics.deployments += 1;
  return this.save();
};

// Method to calculate lines of code
appSchema.methods.calculateLinesOfCode = function() {
  if (this.files && this.files.get('/App.js')) {
    this.metadata.linesOfCode = this.files.get('/App.js').split('\n').length;
  } else {
    this.metadata.linesOfCode = 0;
  }
};

// Static method to get public apps
appSchema.statics.getPublicApps = function(limit = 10) {
  return this.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name avatar');
};

// Static method to get user's apps
appSchema.statics.getUserApps = function(userId, limit = 20) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('App', appSchema); 