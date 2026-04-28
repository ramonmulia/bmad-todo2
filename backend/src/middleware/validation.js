export function validateTodoCreate(req, res, next) {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Text is required and must be a string'
    });
  }

  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Text cannot be empty'
    });
  }

  if (trimmed.length > 500) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Text must be 500 characters or fewer'
    });
  }

  req.body.text = trimmed;
  next();
}

export function validateTodoUpdate(req, res, next) {
  const { completed, text } = req.body;

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Completed must be a boolean'
    });
  }

  if (text !== undefined) {
    if (typeof text !== 'string') {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Text must be a string'
      });
    }
    const trimmed = text.trim();
    if (trimmed.length === 0 || trimmed.length > 500) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Text must be between 1 and 500 characters'
      });
    }
    req.body.text = trimmed;
  }

  next();
}

export function sanitizeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
