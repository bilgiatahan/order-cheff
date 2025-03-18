import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';

interface ErrorResponse {
  message: string;
  error: string;
  stack?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Unknown error';
    let stack: string | undefined;

    this.logger.error('Exception caught:', exception);

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse() as string | ErrorResponse;

      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else {
        message = errorResponse.message || message;
        error = errorResponse.error || error;
      }
    } else if (exception instanceof MongoError) {
      if (exception.code === 11000) {
        status = HttpStatus.CONFLICT;
        message = 'Duplicate key error';
        error = 'A record with the same unique field already exists';
      }
      this.logger.error('MongoDB Error:', exception);
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
      stack = exception.stack;
      this.logger.error('Error:', exception.message, exception.stack);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      stack: process.env.NODE_ENV === 'development' ? stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }
}
