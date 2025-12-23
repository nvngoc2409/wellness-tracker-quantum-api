const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Wellness Tracker API',
        version: '1.0.0',
        description: 'API documentation for the Wellness Tracker Quantum API'
    },
    servers: [
        { url: 'http://localhost:3000', description: 'Local server' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            },
            deviceIdHeader: {
                type: 'apiKey',
                in: 'header',
                name: 'device-id'
            }
        },
        schemas: {
            Album: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    cover_image: { type: 'string', nullable: true }
                }
            },
            WellnessPayload: {
                type: 'object',
                properties: {
                    mood: { type: 'integer' },
                    energy: { type: 'integer' },
                    stress: { type: 'integer' },
                    sleep: { type: 'integer' }
                },
                required: ['mood', 'energy', 'stress', 'sleep']
            }
        }
    },
    paths: {
        '/api/wellness/insight': {
            get: {
                tags: ['Insight'],
                summary: 'Get or create insight (3 random albums) for a date',
                parameters: [
                    { name: 'date', in: 'query', required: true, schema: { type: 'string', example: '2025-12-03' }, description: 'Date in YYYY-MM-DD' }
                ],
                security: [{ bearerAuth: [] }, { deviceIdHeader: [] }],
                responses: {
                    '200': { description: 'Three album objects', content: { 'application/json': { schema: { type: 'object' } } } },
                    '400': { description: 'Invalid request' },
                    '500': { description: 'Server error' }
                }
            }
        },
        '/api/wellness': {
            post: {
                tags: ['Wellness'],
                summary: 'Create wellness log (or add log) for today',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/WellnessPayload' }
                        }
                    }
                },
                security: [{ bearerAuth: [] }, { deviceIdHeader: [] }],
                responses: {
                    '201': { description: 'Created', content: { 'application/json': { schema: { type: 'object' } } } },
                    '400': { description: 'Bad request' },
                    '500': { description: 'Server error' }
                }
            },
            get: {
                tags: ['Wellness'],
                summary: 'Get wellness trends',
                parameters: [
                    { name: 'period', in: 'query', schema: { type: 'string', example: 'week' }, description: 'today|week|month' },
                    { name: 'startDate', in: 'query', schema: { type: 'string', example: '2025-12-01' } },
                    { name: 'endDate', in: 'query', schema: { type: 'string', example: '2025-12-07' } }
                ],
                security: [{ bearerAuth: [] }, { deviceIdHeader: [] }],
                responses: { '200': { description: 'OK' }, '400': { description: 'Bad Request' } }
            }
        },
        '/api/albums': {
            get: {
                tags: ['Albums'],
                summary: 'List albums with optional filtering',
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
                    { name: 'subcategory', in: 'query', schema: { type: 'string' } },
                    { name: 'category', in: 'query', schema: { type: 'string' } }
                ],
                responses: { '200': { description: 'OK' } }
            }
        }
    }
};

export default swaggerSpec;
