const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();

const app = express();
app.use(express.json());
app.set('trust proxy', 1);
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log('❌ MongoDB error:', err));

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, default: 'new', enum: ['new', 'contacted', 'converted', 'lost'] },
  source: { type: String, default: 'website', enum: ['website', 'referral', 'social', 'ad', 'other'] },
  priority: { type: String, default: 'medium', enum: ['low', 'medium', 'high'] },
  tags: [String],
  followUpDate: { type: Date, default: null },
  notes: { type: String, default: '' },
  notesHistory: [   
    {
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);

function requireAdmin(req, res, next) {
  if (req.session.isAdmin) {
    next();  // user is logged in, continue to route
  } else {
    res.status(401).json({ error: 'Unauthorized – please login' });
  }
}

// Hardcoded admin
const ADMIN_EMAIL = 'admin@crm.com';
const ADMIN_PASSWORD = 'admin123';

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    req.session.userEmail = email;
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/leads', requireAdmin, async (req, res) => {
  const allLeads = await Lead.find();
  res.json(allLeads);
});

app.post('/leads', requireAdmin, async (req, res) => {
  const newLead = new Lead({
    name: req.body.name,
    email: req.body.email,
    source: req.body.source || 'website',
    priority: req.body.priority || 'medium',
    tags: req.body.tags || [],
    followUpDate: req.body.followUpDate || null
  });
  await newLead.save();
  res.status(201).json(newLead);
});

app.put('/leads/:id', requireAdmin, async (req, res) => {
  try {
    const leadId = req.params.id;
    const updateData = {
      status: req.body.status,
      notes: req.body.notes,
      source: req.body.source,
      priority: req.body.priority,
      tags: req.body.tags,
      followUpDate: req.body.followUpDate
    };
    
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
  
    const updatedLead = await Lead.findByIdAndUpdate(leadId, updateData, { new: true });
    if (!updatedLead) return res.status(404).json({ error: 'Lead not found' });
    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ error: 'Invalid lead ID or data' });
  }
});

app.delete('/leads/:id', requireAdmin, async (req, res) => {
  try {
    const leadId = req.params.id;
    const deletedLead = await Lead.findByIdAndDelete(leadId);
    if (!deletedLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid lead ID' });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});