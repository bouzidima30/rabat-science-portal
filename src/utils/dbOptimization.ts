
import { supabase } from '@/integrations/supabase/client';

// Pagination helper for large datasets
export interface PaginationOptions {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const paginatedQuery = async <T>(
  tableName: string,
  options: PaginationOptions,
  additionalFilters?: any
): Promise<{
  data: T[];
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> => {
  const { page, pageSize, sortBy = 'created_at', sortOrder = 'desc' } = options;
  const offset = (page - 1) * pageSize;

  // Get total count
  const { count } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true })
    .match(additionalFilters || {});

  // Get paginated data
  let query = supabase
    .from(tableName)
    .select('*')
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + pageSize - 1);

  if (additionalFilters) {
    query = query.match(additionalFilters);
  }

  const { data, error } = await query;

  if (error) throw error;

  const totalCount = count || 0;
  const hasNextPage = offset + pageSize < totalCount;
  const hasPrevPage = page > 1;

  return {
    data: data as T[],
    totalCount,
    hasNextPage,
    hasPrevPage
  };
};

// Batch operations for better performance
export const batchInsert = async <T>(
  tableName: string,
  records: T[],
  batchSize = 100
): Promise<void> => {
  const batches = [];
  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    const { error } = await supabase
      .from(tableName)
      .insert(batch);
    
    if (error) throw error;
  }
};

// Optimized search with debouncing
export const searchContent = async (
  query: string,
  tables: string[],
  searchFields: Record<string, string[]>
): Promise<any[]> => {
  if (!query.trim()) return [];

  const searchPromises = tables.map(async (table) => {
    const fields = searchFields[table] || ['title', 'content'];
    
    // Use full-text search if available, otherwise use ilike
    let searchQuery = supabase
      .from(table)
      .select('*, type:' + `'${table}'::text`);

    // Build OR conditions for multiple fields
    const orConditions = fields
      .map(field => `${field}.ilike.%${query}%`)
      .join(',');

    searchQuery = searchQuery.or(orConditions);

    const { data, error } = await searchQuery.limit(10);
    
    if (error) {
      console.error(`Search error in ${table}:`, error);
      return [];
    }
    
    return data || [];
  });

  const results = await Promise.all(searchPromises);
  return results.flat();
};

// Connection pooling helper
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries - 1) {
        throw lastError;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw lastError!;
};

// Preload critical data
export const preloadCriticalData = async () => {
  const criticalQueries = [
    // Preload recent news
    supabase
      .from('news')
      .select('id, title, excerpt, image_url, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(5),
    
    // Preload upcoming events
    supabase
      .from('events')
      .select('id, titre, date_debut, lieu')
      .gte('date_debut', new Date().toISOString().split('T')[0])
      .order('date_debut', { ascending: true })
      .limit(3),
    
    // Preload popular formations
    supabase
      .from('formations')
      .select('id, titre, type_formation')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(10)
  ];

  try {
    await Promise.all(criticalQueries);
    console.log('Critical data preloaded successfully');
  } catch (error) {
    console.error('Error preloading critical data:', error);
  }
};
