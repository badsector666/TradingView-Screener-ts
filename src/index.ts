import { Elysia, t, Context } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { Query, col, And, Or, MARKETS_LIST } from './exports';
import type { FilterOperationDict, OperationDict } from './exports';

// Define the interface for the request body
interface QueryRequestBody {
  columns?: string[];
  markets?: string[];
  filters?: {
    column: string;
    operation: string;
    value: any; // This might need refinement if specific types are known
  }[];
  orderBy?: string;
  orderDirection?: boolean;
  limit?: number;
  offset?: number;
}

// Define the schema for Elysia
const querySchema = {
  body: t.Object({
    columns: t.Optional(t.Array(t.String())),
    markets: t.Optional(t.Array(t.String())),
    filters: t.Optional(t.Array(t.Object({
      column: t.String(),
      operation: t.String(),
      value: t.Any() // Consider refining this if possible, e.g., t.Union([t.String(), t.Number(), t.Array(t.Any())])
    }))),
    orderBy: t.Optional(t.String()),
    orderDirection: t.Optional(t.Boolean()),
    limit: t.Optional(t.Numeric()),
    offset: t.Optional(t.Numeric())
  })
};

const app = new Elysia()
  .use(cors())
  .use(staticPlugin({
    assets: 'public',
    prefix: '/'
  }))
  
  // Serve the HTML interface
  .get('/', () => Bun.file('public/index.html'))
  
  // API endpoint to get available markets
  .get('/api/markets', () => ({
    success: true,
    data: MARKETS_LIST
  }))
  
  // API endpoint to execute queries
  .post('/api/query', async (context: Context<{ body: QueryRequestBody }>) => { // Use imported Context
    const { body } = context; // Destructure body from context

    try {
      const { 
        columns = ['name', 'close', 'volume', 'market_cap_basic'],
        markets = ['america'],
        filters = [],
        orderBy,
        orderDirection = false,
        limit = 50,
        offset = 0
      } = body; // body is now typed by Elysia's schema

      let query = new Query()
        .select(...columns)
        .setMarkets(...markets)
        .limit(limit)
        .offset(offset);

      // Apply filters if provided
      if (filters && filters.length > 0) {
        const filterOperations = filters.map((filter: any) => {
          const column = col(filter.column);
          const value = filter.value;
          
          switch (filter.operation) {
            case 'gt': return column.gt(value);
            case 'gte': return column.gte(value);
            case 'lt': return column.lt(value);
            case 'lte': return column.lte(value);
            case 'eq': return column.eq(value);
            case 'ne': return column.ne(value);
            case 'between': return column.between(value[0], value[1]);
            case 'isin': return column.isin(value);
            default: return column.gt(0);
          }
        });
        
        query = query.where(...filterOperations);
      }

      // Apply ordering if specified
      if (orderBy) {
        query = query.orderBy(orderBy, orderDirection);
      }

      const result = await query.getScannerData();
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Query execution error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }, querySchema) // Pass the schema here
  
  // Health check endpoint
  .get('/api/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString()
  }))
  
  .listen(3000);

console.log(`🦊 TradingView Screener Server is running at http://localhost:3000`);