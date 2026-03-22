const { v4: uuidv4 } = require('uuid');

// In-memory data store
const db = {
  users: [],
  leads: [],
  campaigns: [],
};

// Helper to generate IDs
const generateId = () => uuidv4();

// Generic CRUD helpers
const store = {
  // Users
  findUserByEmail: (email) => db.users.find(u => u.email === email),
  findUserById: (id) => db.users.find(u => u.id === id),
  createUser: (userData) => {
    const user = { id: generateId(), createdAt: new Date().toISOString(), ...userData };
    db.users.push(user);
    return user;
  },

  // Leads
  getLeads: (ownerId) => db.leads.filter(l => l.owner === ownerId),
  getLeadById: (id, ownerId) => db.leads.find(l => l.id === id && l.owner === ownerId),
  createLead: (leadData) => {
    const lead = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      interactions: [],
      tags: [],
      ...leadData,
    };
    db.leads.push(lead);
    return lead;
  },
  updateLead: (id, ownerId, updates) => {
    const idx = db.leads.findIndex(l => l.id === id && l.owner === ownerId);
    if (idx === -1) return null;
    db.leads[idx] = { ...db.leads[idx], ...updates, updatedAt: new Date().toISOString() };
    return db.leads[idx];
  },
  deleteLead: (id, ownerId) => {
    const idx = db.leads.findIndex(l => l.id === id && l.owner === ownerId);
    if (idx === -1) return false;
    db.leads.splice(idx, 1);
    return true;
  },
  addInteraction: (id, ownerId, interaction) => {
    const lead = db.leads.find(l => l.id === id && l.owner === ownerId);
    if (!lead) return null;
    lead.interactions.push({
      id: generateId(),
      ...interaction,
      date: new Date().toISOString(),
    });
    return lead;
  },

  // Campaigns
  getCampaigns: (ownerId) => db.campaigns.filter(c => c.owner === ownerId),
  getCampaignById: (id, ownerId) => db.campaigns.find(c => c.id === id && c.owner === ownerId),
  createCampaign: (campaignData) => {
    const campaign = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: 'draft',
      metrics: { sent: 0, opened: 0, clicked: 0, converted: 0 },
      ...campaignData,
    };
    db.campaigns.push(campaign);
    return campaign;
  },
  updateCampaign: (id, ownerId, updates) => {
    const idx = db.campaigns.findIndex(c => c.id === id && c.owner === ownerId);
    if (idx === -1) return null;
    db.campaigns[idx] = { ...db.campaigns[idx], ...updates, updatedAt: new Date().toISOString() };
    return db.campaigns[idx];
  },
  deleteCampaign: (id, ownerId) => {
    const idx = db.campaigns.findIndex(c => c.id === id && c.owner === ownerId);
    if (idx === -1) return false;
    db.campaigns.splice(idx, 1);
    return true;
  },

  // Access raw db for seeding
  getDb: () => db,
};

module.exports = store;
