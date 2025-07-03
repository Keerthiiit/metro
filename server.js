const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // allow frontend on GitHub Pages to call backend
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Mongoose Schema
const PaymentSchema = new mongoose.Schema({
  ticketCount: Number,
  paymentMethod: String,
  paymentDetails: mongoose.Schema.Types.Mixed,
  totalFare: Number,
  createdAt: { type: Date, default: Date.now }
});
const Payment = mongoose.model('Payment', PaymentSchema);

// Routes
app.get('/', (req, res) => {
  res.send('🚀 Backend is running');
});

app.post('/pay', async (req, res) => {
  console.log('POST /pay body:', req.body);

  const { ticketCount, paymentMethod } = req.body;
  const totalFare = ticketCount * 50;

  const paymentDetails = {};
  if (paymentMethod === 'credit' || paymentMethod === 'debit') {
    paymentDetails.cardNumber = req.body['paymentDetails.cardNumber'];
  } else if (paymentMethod === 'upi') {
    paymentDetails.upiId = req.body['paymentDetails.upiId'];
  }

  try {
    const payment = new Payment({
      ticketCount,
      paymentMethod,
      paymentDetails,
      totalFare
    });

    await payment.save();
    res.send(`<h2>Payment received for ₹${totalFare}. Thank you!</h2>`);
  } catch (error) {
    console.error('❌ Error saving payment:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
