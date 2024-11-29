import Joi from 'joi';

// Validation schema for prompt generation request
const promptGenerationSchema = Joi.object({
  input: Joi.string().required().min(1).max(4000),
  config: Joi.object({
    model: Joi.string().required().valid(
      'gpt-4',
      'gpt-3.5-turbo',
      'claude-2',
      'palm-2',
      'llama-2'
    ),
    context: Joi.object({
      domain: Joi.string().required(),
      industry: Joi.string().required(),
      audience: Joi.string().required(),
      locale: Joi.string().required()
    }).required(),
    parameters: Joi.object({
      temperature: Joi.number().min(0).max(2).default(0.7),
      topP: Joi.number().min(0).max(1).default(1),
      presencePenalty: Joi.number().min(-2).max(2).default(0),
      frequencyPenalty: Joi.number().min(-2).max(2).default(0),
      maxTokens: Joi.number().min(1).max(100000).default(2000)
    }).default(),
    features: Joi.object({
      chainOfThought: Joi.boolean().default(false),
      fewShotLearning: Joi.boolean().default(false),
      constraintSatisfaction: Joi.boolean().default(false),
      factChecking: Joi.boolean().default(false),
      biasDetection: Joi.boolean().default(false)
    }).default(),
    output: Joi.object({
      format: Joi.string().valid('plain', 'markdown', 'html', 'json', 'latex', 'custom').default('plain'),
      includeReasoning: Joi.boolean().default(false),
      includeAlternatives: Joi.boolean().default(false),
      customTemplate: Joi.string().when('format', {
        is: 'custom',
        then: Joi.required(),
        otherwise: Joi.forbidden()
      })
    }).default()
  }).required()
});

// Middleware to validate prompt generation requests
export const validatePromptRequest = (req, res, next) => {
  const { error } = promptGenerationSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false
  });

  if (error) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Invalid request parameters',
      details
    });
  }

  next();
};

// Validate prompt generation request
export const validatePromptGeneration = (req, res, next) => {
  const { input, config } = req.body;

  if (!input || typeof input !== 'string' || input.trim().length === 0) {
    return res.status(400).json({
      error: 'Invalid input',
      details: 'Input text is required and must be a non-empty string'
    });
  }

  if (!config || typeof config !== 'object') {
    return res.status(400).json({
      error: 'Invalid configuration',
      details: 'Configuration object is required'
    });
  }

  const requiredConfigFields = ['model', 'maxTokens', 'temperature'];
  const missingFields = requiredConfigFields.filter(field => !(field in config));

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing configuration fields',
      details: `Required fields missing: ${missingFields.join(', ')}`
    });
  }

  // Validate specific field constraints
  if (!['gpt-4', 'gpt-3.5-turbo', 'claude-2', 'palm-2', 'llama-2'].includes(config.model)) {
    return res.status(400).json({
      error: 'Invalid model',
      details: 'Specified model is not supported'
    });
  }

  if (typeof config.maxTokens !== 'number' || config.maxTokens < 1 || config.maxTokens > 100000) {
    return res.status(400).json({
      error: 'Invalid maxTokens',
      details: 'maxTokens must be a number between 1 and 100000'
    });
  }

  if (typeof config.temperature !== 'number' || config.temperature < 0 || config.temperature > 2) {
    return res.status(400).json({
      error: 'Invalid temperature',
      details: 'temperature must be a number between 0 and 2'
    });
  }

  next();
};

// Validation schema for prompt analysis request
const promptAnalysisSchema = Joi.object({
  prompt: Joi.string().required().min(1).max(4000),
  context: Joi.object({
    domain: Joi.string().required(),
    industry: Joi.string().required(),
    audience: Joi.string().required(),
    locale: Joi.string().required()
  }).required()
});

// Middleware to validate prompt analysis requests
export const validateAnalysisRequest = (req, res, next) => {
  const { error } = promptAnalysisSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false
  });

  if (error) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Invalid analysis parameters',
      details
    });
  }

  next();
};

// Validation schema for prompt refinement request
const promptRefinementSchema = Joi.object({
  prompt: Joi.string().required().min(1).max(4000),
  metrics: Joi.object({
    score: Joi.number().required().min(0).max(1),
    clarity: Joi.number().required().min(0).max(1),
    specificity: Joi.number().required().min(0).max(1),
    coherence: Joi.number().required().min(0).max(1),
    relevance: Joi.number().required().min(0).max(1),
    suggestions: Joi.array().items(
      Joi.object({
        type: Joi.string().valid('improvement', 'positive').required(),
        text: Joi.string().required()
      })
    ).required(),
    patterns: Joi.array().items(Joi.string()).required()
  }).required(),
  config: Joi.object({
    context: Joi.object({
      domain: Joi.string().required(),
      industry: Joi.string().required(),
      audience: Joi.string().required(),
      locale: Joi.string().required()
    }).required(),
    output: Joi.object({
      format: Joi.string().valid('plain', 'markdown', 'html', 'json', 'latex', 'custom').default('plain'),
      includeReasoning: Joi.boolean().default(false),
      includeAlternatives: Joi.boolean().default(false),
      customTemplate: Joi.string().when('format', {
        is: 'custom',
        then: Joi.required(),
        otherwise: Joi.forbidden()
      })
    }).default()
  }).required()
});

// Middleware to validate prompt refinement requests
export const validateRefinementRequest = (req, res, next) => {
  const { error } = promptRefinementSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false
  });

  if (error) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Invalid refinement parameters',
      details
    });
  }

  next();
};
