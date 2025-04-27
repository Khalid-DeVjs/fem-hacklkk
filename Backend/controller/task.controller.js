
import Task from '../models/Task.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }




};






// @desc    Get all tasks for current user (created or assigned)
// @route   GET /api/tasks/myalltasks
// @access  Private
export const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user.id },
        { assignedTo: req.user.id }
      ]
    })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};



export const getAllRawTasks = async (req, res, next) => {
  try {
    // Get EVERY task from the database
    const tasks = await Task.find({});
    
    // Send raw task data
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};



// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    // Add logged-in user as the assignedTo user
    req.body.assignedTo = req.user.id; // Assuming your auth middleware adds user to req.user
    
    // Create task
    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};
// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is task owner


    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
    }

    // If task has no owner, allow deletion (or restrict to admins if needed)
    if (!task.createdBy) {
      console.warn(`Deleting orphaned task: ${task._id}`); // Log for debugging
      await task.deleteOne();
      return res.status(200).json({ success: true, data: {} });
    }

    // If task has an owner, check permissions
    if (task.createdBy.toString() !== req.user.id) {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this task`, 401));
    }

    await task.deleteOne();
    res.status(200).json({ success: true, data: {} });

  } catch (err) {
    next(err);
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['To Do', 'In Progress', 'Done'];

    if (!validStatuses.includes(status)) {
      return next(new ErrorResponse(`Invalid status: ${status}`, 400));
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is task owner or assigned user
    if (
      task.createdBy.toString() !== req.user.id &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this task status`,
          401
        )
      );
    }

    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};