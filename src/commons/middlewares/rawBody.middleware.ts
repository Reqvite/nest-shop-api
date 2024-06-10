import {json} from 'body-parser';
import {Response} from 'express';
import {RequestWithRawBody} from '@/types/stripe.interface';

function rawBodyMiddleware() {
  return json({
    verify: (request: RequestWithRawBody, response: Response, buffer: Buffer) => {
      if (request.url === '/api/stripe/webhook' && Buffer.isBuffer(buffer)) {
        request.rawBody = Buffer.from(buffer);
      }
      return true;
    }
  });
}

export default rawBodyMiddleware;
