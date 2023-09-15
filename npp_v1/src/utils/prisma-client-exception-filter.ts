import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch()
// PrismaClientValidationError ||
//   PrismaClientKnownRequestError ||
//   PrismaClientInitializationError ||
//   PrismaClientRustPanicError ||
//   PrismaClientUnknownRequestError,
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log(exception);
    let statusCode = 400;
    let message = exception?.response?.message || 'BAD REQUEST';
    if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        statusCode = 409;
        message = 'Duplicate key violation error ' + exception?.meta?.target;
      }
    }
    if (exception instanceof PrismaClientValidationError) {
      statusCode = 400;
      message = exception.message;
    }
    response.status(statusCode).json({
      statusCode: statusCode,
      message,
    });
  }
}
