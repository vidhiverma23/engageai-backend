require('dotenv').config();
const bcrypt = require('bcryptjs');
const store = require('./data/store');

async function seed() {
  console.log('🌱 Seeding EngageAI database...');

  // Create demo user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('demo123', salt);
  const user = store.createUser({
    name: 'Sarah Johnson',
    email: 'demo@engageai.com',
    password: hashedPassword,
    role: 'admin',
  });

  // Create leads
  const leadData = [
    { name: 'Alex Chen', email: 'alex.chen@techcorp.com', company: 'TechCorp', status: 'hot', phone: '+1-555-0101', tags: ['enterprise', 'decision-maker'] },
    { name: 'Maria Rodriguez', email: 'maria@innovatech.io', company: 'InnovaTech', status: 'hot', phone: '+1-555-0102', tags: ['startup', 'CEO'] },
    { name: 'James Wilson', email: 'j.wilson@globalco.com', company: 'GlobalCo', status: 'warm', phone: '+1-555-0103', tags: ['mid-market', 'IT-director'] },
    { name: 'Priya Sharma', email: 'priya.s@digitalnext.in', company: 'DigitalNext', status: 'hot', phone: '+91-555-0104', tags: ['enterprise', 'CTO'] },
    { name: 'David Park', email: 'dpark@cloudnine.co', company: 'CloudNine', status: 'warm', phone: '+1-555-0105', tags: ['SaaS', 'VP-Sales'] },
    { name: 'Emma Thompson', email: 'emma.t@mediapulse.com', company: 'MediaPulse', status: 'cold', phone: '+44-555-0106', tags: ['media', 'marketing-head'] },
    { name: 'Raj Patel', email: 'raj@nexusdata.com', company: 'NexusData', status: 'warm', phone: '+1-555-0107', tags: ['data', 'analytics'] },
    { name: 'Sophie Laurent', email: 'sophie@eureka.fr', company: 'Eureka Labs', status: 'cold', phone: '+33-555-0108', tags: ['research', 'AI'] },
    { name: 'Tom Baker', email: 'tom.b@retailmax.com', company: 'RetailMax', status: 'hot', phone: '+1-555-0109', tags: ['retail', 'e-commerce'] },
    { name: 'Aisha Khan', email: 'aisha@fintechpro.com', company: 'FinTechPro', status: 'warm', phone: '+1-555-0110', tags: ['fintech', 'CFO'] },
    { name: 'Chris Lee', email: 'chris.lee@devstudio.io', company: 'DevStudio', status: 'cold', phone: '+1-555-0111', tags: ['development', 'freelance'] },
    { name: 'Lena Fischer', email: 'lena.f@greentech.de', company: 'GreenTech', status: 'warm', phone: '+49-555-0112', tags: ['sustainability', 'clean-energy'] },
    { name: 'Marcus Johnson', email: 'marcus@healthbridge.com', company: 'HealthBridge', status: 'cold', phone: '+1-555-0113', tags: ['healthcare', 'VP-Product'] },
    { name: 'Yuki Tanaka', email: 'yuki@robotics.jp', company: 'NextGen Robotics', status: 'hot', phone: '+81-555-0114', tags: ['robotics', 'automation'] },
    { name: 'Carlos Mendez', email: 'carlos@logitrack.mx', company: 'LogiTrack', status: 'warm', phone: '+52-555-0115', tags: ['logistics', 'supply-chain'] },
    { name: 'Natasha Ivanova', email: 'natasha@cyberguard.ru', company: 'CyberGuard', status: 'cold', phone: '+7-555-0116', tags: ['cybersecurity', 'CISO'] },
    { name: 'Ben Roberts', email: 'ben@edulearn.com', company: 'EduLearn', status: 'warm', phone: '+1-555-0117', tags: ['education', 'ed-tech'] },
    { name: 'Fatima Al-Rashid', email: 'fatima@smartcity.ae', company: 'SmartCity Solutions', status: 'hot', phone: '+971-555-0118', tags: ['smart-city', 'IoT'] },
    { name: 'Dylan Murphy', email: 'dylan@adpeak.ie', company: 'AdPeak', status: 'cold', phone: '+353-555-0119', tags: ['advertising', 'PPC'] },
    { name: 'Olivia Martin', email: 'olivia@brandcraft.com', company: 'BrandCraft', status: 'warm', phone: '+1-555-0120', tags: ['branding', 'design'] },
  ];

  const createdLeads = [];
  for (const ld of leadData) {
    const lead = store.createLead({ ...ld, owner: user.id });
    createdLeads.push(lead);
  }

  // Add interactions to some leads
  const interactionTypes = ['email', 'call', 'meeting', 'note', 'demo'];
  const interactionNotes = [
    'Initial outreach - showed strong interest',
    'Follow-up call - discussed pricing',
    'Product demo scheduled',
    'Sent case study materials',
    'Meeting with decision makers',
    'Contract negotiation in progress',
    'Requested custom proposal',
    'Positive feedback on trial',
  ];

  for (const lead of createdLeads) {
    const numInteractions = lead.status === 'hot' ? 4 : lead.status === 'warm' ? 2 : 1;
    for (let i = 0; i < numInteractions; i++) {
      store.addInteraction(lead.id, user.id, {
        type: interactionTypes[Math.floor(Math.random() * interactionTypes.length)],
        note: interactionNotes[Math.floor(Math.random() * interactionNotes.length)],
      });
    }
  }

  // Create campaigns
  const campaignData = [
    {
      name: 'Product Launch 2024',
      subject: '🚀 Introducing EngageAI Pro - Transform Your Customer Engagement',
      body: '<h1>EngageAI Pro is Here!</h1><p>Discover AI-powered customer engagement like never before.</p>',
      status: 'sent',
      sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      metrics: { sent: 150, opened: 98, clicked: 45, converted: 12 },
    },
    {
      name: 'Weekly Newsletter #42',
      subject: '📊 This Week in Engagement - Key Insights & Tips',
      body: '<h1>Weekly Insights</h1><p>Top performing strategies this week...</p>',
      status: 'sent',
      sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      metrics: { sent: 200, opened: 142, clicked: 68, converted: 20 },
    },
    {
      name: 'Re-engagement Campaign',
      subject: '💫 We miss you! Here\'s what\'s new at EngageAI',
      body: '<h1>Come Back!</h1><p>See the latest features we\'ve added just for you.</p>',
      status: 'sent',
      sentAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      metrics: { sent: 80, opened: 35, clicked: 15, converted: 5 },
    },
    {
      name: 'Holiday Special Offer',
      subject: '🎉 Exclusive 30% Off - Limited Time Only!',
      body: '<h1>Holiday Special</h1><p>Get 30% off on all premium plans this holiday season.</p>',
      status: 'sent',
      sentAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      metrics: { sent: 300, opened: 195, clicked: 87, converted: 32 },
    },
    {
      name: 'Q1 Strategy Update',
      subject: '📈 Q1 Customer Engagement Strategy Guide',
      body: '<h1>Q1 Strategy</h1><p>Plan your engagement strategy for the new quarter.</p>',
      status: 'scheduled',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      metrics: { sent: 0, opened: 0, clicked: 0, converted: 0 },
    },
    {
      name: 'Case Study: TechCorp Success',
      subject: '📋 How TechCorp Increased Engagement by 340%',
      body: '<h1>Success Story</h1><p>Learn how TechCorp transformed their customer engagement...</p>',
      status: 'draft',
      metrics: { sent: 0, opened: 0, clicked: 0, converted: 0 },
    },
    {
      name: 'Feature Announcement: AI Insights',
      subject: '🧠 New: AI-Powered Engagement Insights',
      body: '<h1>AI Insights</h1><p>Our new AI module provides smart recommendations...</p>',
      status: 'sent',
      sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      metrics: { sent: 180, opened: 120, clicked: 55, converted: 18 },
    },
  ];

  for (const cd of campaignData) {
    store.createCampaign({ ...cd, owner: user.id, recipients: [] });
  }

  console.log('✅ Seed complete!');
  console.log(`   👤 User: demo@engageai.com / demo123`);
  console.log(`   📋 ${createdLeads.length} leads created`);
  console.log(`   📧 ${campaignData.length} campaigns created`);
}

module.exports = seed;
