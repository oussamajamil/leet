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
      if (exception.code === 'P2025') {
        statusCode = 404;
        message = exception?.meta?.cause || 'Record to delete does not exist.';
      }
      if (exception.code === 'P2016') {
        statusCode = 404;
        message = exception?.meta?.cause || 'Record to update does not exist.';
      }
      if (exception.code === 'P2017') {
        statusCode = 400;
        message = exception?.meta?.cause || 'Invalid relation.';
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
