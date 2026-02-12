import { z } from 'zod';
import { insertComparisonSchema, insertItemSchema, comparisons, items } from './schema';

export const api = {
  comparisons: {
    list: {
      method: 'GET' as const,
      path: '/api/comparisons' as const,
      responses: {
        200: z.array(z.custom<any>()), // ComparisonWithItems[]
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/comparisons' as const,
      input: insertComparisonSchema,
      responses: {
        201: z.custom<typeof comparisons.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/comparisons/:id' as const,
      responses: {
        200: z.custom<any>(), // ComparisonWithItems
        404: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/comparisons/:id' as const,
      responses: {
        204: z.void(),
      },
    }
  },
  items: {
    create: {
      method: 'POST' as const,
      path: '/api/comparisons/:id/items' as const,
      input: insertItemSchema.omit({ comparisonId: true }),
      responses: {
        201: z.custom<typeof items.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/items/:id' as const,
      responses: {
        204: z.void(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
