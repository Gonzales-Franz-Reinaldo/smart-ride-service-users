import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Root')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Endpoint raíz del API' })
  @ApiResponse({ status: 200, description: 'Información del servicio' })
  getRoot() {
    return {
      service: 'Smart Ride - Users Service',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        swagger: '/api/v1/docs',
        graphql: '/graphql',
        health: '/api/v1/health',
        auth: '/api/v1/auth',
        users: '/api/v1/users',
      },
      timestamp: new Date().toISOString(),
    };
  }
}