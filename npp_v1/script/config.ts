const config = {
  String: {
    type: 'string',
    validation: ['@IsString()', '@MaxLength(255)', '@MinLength(1)'],
  },
  Int: {
    type: 'number',
    validation: ['@IsNumber()', '@IsNotEmpty()', '@Min(1)'],
  },
  Boolean: {
    type: 'boolean',
    validation: ['@IsBoolean()'],
  },
  DateTime: {
    type: 'Date',
    validation: ['@IsDate()'],
  },
};

export default config;
