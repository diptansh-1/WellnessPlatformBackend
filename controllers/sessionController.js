const Session = require('../models/Session');

const getSessions = async (req, res) => {
  try {
    const { page = 1, limit = 10, tags } = req.query;
    
    const filter = { status: 'published' };
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      filter.tags = { $in: tagArray };
    }

    const sessions = await Session.find(filter)
      .populate('user_id', 'email')
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Session.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        sessions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching sessions'
    });
  }
};
const getMySessions = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { user_id: req.user._id };
    if (status && ['draft', 'published'].includes(status)) {
      filter.status = status;
    }

    const sessions = await Session.find(filter)
      .sort({ updated_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Session.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        sessions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get my sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your sessions'
    });
  }
};


const getMySession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching session'
    });
  }
};


const saveDraft = async (req, res) => {
  try {
    const { title, tags, json_file_url, sessionId } = req.body;

    const processedTags = tags ? tags.map(tag => tag.trim().toLowerCase()).filter(tag => tag) : [];

    const sessionData = {
      user_id: req.user._id,
      title,
      tags: processedTags,
      json_file_url,
      status: 'draft'
    };

    let session;

    if (sessionId) {
      session = await Session.findOneAndUpdate(
        { _id: sessionId, user_id: req.user._id, status: 'draft' },
        sessionData,
        { new: true, runValidators: true }
      );

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Draft session not found or already published'
        });
      }
    } else {
      // Create new draft
      session = await Session.create(sessionData);
    }

    res.status(200).json({
      success: true,
      message: sessionId ? 'Draft updated successfully' : 'Draft saved successfully',
      data: session
    });
  } catch (error) {
    console.error('Save draft error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error saving draft'
    });
  }
};


const publishSession = async (req, res) => {
  try {
    const { title, tags, json_file_url, sessionId } = req.body;

    const processedTags = tags ? tags.map(tag => tag.trim().toLowerCase()).filter(tag => tag) : [];

    const sessionData = {
      user_id: req.user._id,
      title,
      tags: processedTags,
      json_file_url,
      status: 'published'
    };

    let session;

    if (sessionId) {
      // Update existing session and publish
      session = await Session.findOneAndUpdate(
        { _id: sessionId, user_id: req.user._id },
        sessionData,
        { new: true, runValidators: true }
      );

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }
    } else {
      // Create new published session
      session = await Session.create(sessionData);
    }

    res.status(200).json({
      success: true,
      message: 'Session published successfully',
      data: session
    });
  } catch (error) {
    console.error('Publish session error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error publishing session'
    });
  }
};

const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting session'
    });
  }
};

module.exports = {
  getSessions,
  getMySessions,
  getMySession,
  saveDraft,
  publishSession,
  deleteSession
};
