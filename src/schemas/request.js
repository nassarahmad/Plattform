const { z } = require('zod');

exports.createRequestSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(500),
    category: z.enum(['medical', 'food', 'transport', 'evacuation', 'other']),
    urgency: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    location: z.array(z.number()).length(2) // [longitude, latitude]
  })
});