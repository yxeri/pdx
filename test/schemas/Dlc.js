module.exports = {
  type: 'object',
  required: [
    'name',
    'tags',
    'description',
  ],
  properties: {
    name: { type: 'string' },
    tags: {
      type: 'array',
      items: { type: 'string' },
    },
    description: { type: 'string' },
  },
};
