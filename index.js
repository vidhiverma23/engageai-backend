require('dotenv').config();
const express = require('express');
const cors = require('cors');
const seed = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/insights', require('./routes/insights'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EngageAI API is running' });
});

// Start server + seed
async function start() {
  await seed();
  app.listen(PORT, () => {
    console.log(`\n🚀 EngageAI API running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
  });
}

start();
