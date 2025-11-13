import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type (YYYY-MM-DD)';

  // Serializar: Date -> String (para enviar al cliente)
  serialize(value: Date | string): string {
    if (value instanceof Date) {
      return value.toISOString().split('T')[0]; // "2027-12-30"
    }
    if (typeof value === 'string') {
      return value.split('T')[0]; // Por si ya es string ISO
    }
    throw new Error('DateScalar: Value must be a Date or ISO string');
  }

  // Parsear desde el cliente: String -> Date
  parseValue(value: string): Date {
    return new Date(value);
  }

  // Parsear desde un literal AST: String -> Date
  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error('DateScalar: Invalid literal value');
  }
}
