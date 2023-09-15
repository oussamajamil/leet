import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(
  PrismaClientValidationError ||
    PrismaClientKnownRequestError ||
    PrismaClientInitializationError ||
    PrismaClientRustPanicError ||
    PrismaClientUnknownRequestError,
)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
  
    let status = HttpStatus.BAD_REQUEST;
    let message = 'Internal server error';

    if (exception instanceof PrismaClientKnownRequestError) {
      // Handle Prisma-specific errors
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }
    if (exception instanceof PrismaClientValidationError) {
      // Handle Prisma validation errors
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }
    if (exception instanceof PrismaClientInitializationError) {
      // Handle Prisma initialization errors
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }
    if (exception instanceof PrismaClientRustPanicError) {
      // Handle Prisma Rust panic errors
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }
    if (exception instanceof PrismaClientUnknownRequestError) {
      // Handle Prisma unknown request errors
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }
    if (exception instanceof PrismaClientUnknownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }
    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
