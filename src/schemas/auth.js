const { z } = require('zod');

exports.registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email().toLowerCase(),
    password: z.string().min(6).max(50),
    role: z.enum(['help_seeker', 'helper', 'organization', 'admin']).optional(),
    phone: z.string().optional()
  })
});

exports.loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});