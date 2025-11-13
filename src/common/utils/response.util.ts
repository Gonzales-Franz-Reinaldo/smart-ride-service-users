export class ResponseUtil {
  static success<T>(data: T, message?: string) {
    return {
      success: true,
      message: message || 'Operación exitosa',
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message: string, errors?: any) {
    return {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    };
  }
}
