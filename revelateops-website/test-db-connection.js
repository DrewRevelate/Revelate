// Quick test to verify database connection works
require('dotenv').config({ path: '.env.local' });

async function testDatabaseConnection() {
  console.log('🧪 Testing Neon Postgres Connection...\n');

  const { sql } = require('@vercel/postgres');

  try {
    // Test basic connection
    console.log('1. Testing connection...');
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Connected! Current time:', result.rows[0].current_time);

    // Verify tables exist
    console.log('\n2. Checking tables...');
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    console.log('✅ Tables found:');
    tables.rows.forEach(row => {
      console.log('   -', row.table_name);
    });

    // Check if our specific tables exist
    const tableNames = tables.rows.map(r => r.table_name);
    const hasConversations = tableNames.includes('conversations');
    const hasMessages = tableNames.includes('messages');

    console.log('\n3. Verifying chat system tables...');
    if (hasConversations && hasMessages) {
      console.log('✅ Both required tables exist!');
      console.log('   - conversations ✓');
      console.log('   - messages ✓');
    } else {
      console.log('❌ Missing tables:');
      if (!hasConversations) console.log('   - conversations (missing)');
      if (!hasMessages) console.log('   - messages (missing)');
    }

    // Test table structure
    console.log('\n4. Testing table structure...');
    const conversationsColumns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'conversations'
    `;
    console.log('✅ Conversations columns:', conversationsColumns.rows.length);

    const messagesColumns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'messages'
    `;
    console.log('✅ Messages columns:', messagesColumns.rows.length);

    console.log('\n✅ Database is ready for the chat system!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Database connection error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

testDatabaseConnection();
