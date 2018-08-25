import awsServerlessExpress from 'aws-serverless-express';
import expressApp from './expressApp';

// const IS_OFFLINE = process.env.IS_OFFLINE === 'true';

const server = awsServerlessExpress.createServer(expressApp);

export const express_handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context);
