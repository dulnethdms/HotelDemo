const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured');
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function assertNoError(result) {
  if (result.error) throw result.error;
  return result.data;
}

function matchesFilter(row, filter = {}) {
  return Object.entries(filter).every(([key, value]) => {
    if (key === '$or') return value.some((branch) => matchesFilter(row, branch));
    if (value && typeof value === 'object' && '$gte' in value) return row[key] >= value.$gte;
    return row[key] === value;
  });
}

class Query {
  constructor(table, filter) {
    this.table = table;
    this.filter = filter;
    this.orderBy = null;
    this.orderAscending = true;
    this.limitValue = null;
  }

  sort(order) {
    const [field, direction] = Object.entries(order)[0];
    this.orderBy = field;
    this.orderAscending = direction !== -1;
    return this;
  }

  limit(value) {
    this.limitValue = value;
    return this;
  }

  async toArray() {
    const result = await supabase.from(this.table).select('*');
    let rows = assertNoError(result).filter((row) => matchesFilter(row, this.filter));
    if (this.orderBy) {
      rows.sort((a, b) => {
        if (a[this.orderBy] === b[this.orderBy]) return 0;
        const comparison = a[this.orderBy] > b[this.orderBy] ? 1 : -1;
        return this.orderAscending ? comparison : -comparison;
      });
    }
    return this.limitValue ? rows.slice(0, this.limitValue) : rows;
  }
}

class Collection {
  constructor(table) {
    this.table = table;
  }

  find(filter = {}) {
    return new Query(this.table, filter);
  }

  async findOne(filter = {}) {
    return (await this.find(filter).limit(1).toArray())[0] || null;
  }

  async insertOne(document) {
    assertNoError(await supabase.from(this.table).insert(document));
    return { acknowledged: true };
  }

  async insertMany(documents) {
    assertNoError(await supabase.from(this.table).insert(documents));
    return { acknowledged: true, insertedCount: documents.length };
  }

  async updateOne(filter, update, options = {}) {
    const current = await this.findOne(filter);
    if (!current && options.upsert) {
      const document = { ...filter, ...(update.$set || {}) };
      await this.insertOne(document);
      return { acknowledged: true, upsertedCount: 1 };
    }
    if (!current) return { acknowledged: true, matchedCount: 0 };
    const changes = { ...(update.$set || {}) };
    for (const [key, value] of Object.entries(update.$inc || {})) changes[key] = (current[key] || 0) + value;
    for (const [key, value] of Object.entries(update.$max || {})) changes[key] = Math.max(current[key] || 0, value);
    assertNoError(await supabase.from(this.table).update(changes).match(this.primaryFilter(current)));
    return { acknowledged: true, matchedCount: 1 };
  }

  async replaceOne(filter, document) {
    assertNoError(await supabase.from(this.table).update(document).match(this.primaryFilter(await this.findOne(filter))));
    return { acknowledged: true, matchedCount: 1 };
  }

  async deleteOne(filter) {
    const current = await this.findOne(filter);
    if (!current) return { acknowledged: true, deletedCount: 0 };
    assertNoError(await supabase.from(this.table).delete().match(this.primaryFilter(current)));
    return { acknowledged: true, deletedCount: 1 };
  }

  async countDocuments(filter = {}) {
    return (await this.find(filter).toArray()).length;
  }

  async createIndex() {
    return null;
  }

  async bulkWrite(operations) {
    for (const operation of operations) {
      const { filter, update, upsert } = operation.updateOne;
      await this.updateOne(filter, update, { upsert });
    }
  }

  primaryFilter(row) {
    if (row.id !== undefined) return { id: row.id };
    if (row.name !== undefined) return { name: row.name };
    return { content_key: row.content_key };
  }
}

function collection(name) {
  return new Collection(name);
}

async function nextId(sequence) {
  const counters = collection('_counters');
  const current = await counters.findOne({ name: sequence });
  const value = (current?.value || 0) + 1;
  if (current) {
    await counters.updateOne({ name: sequence }, { $set: { value } });
  } else {
    await counters.insertOne({ name: sequence, value });
  }
  return value;
}

async function health() {
  assertNoError(await supabase.from('_counters').select('name').limit(1));
}

async function close() {}

module.exports = { collection, getDb: () => ({ collection }), nextId, health, close };
