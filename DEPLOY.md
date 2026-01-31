# 🚀 ScamShield Backend Deployment Guide

## 📋 Prerequisites
- MongoDB Atlas account
- Cloudinary account
- SendGrid account
- OpenAI API key

## 🛠️ Setup

1. **Copy environment template:**
   ```bash
   cp env.example .env
   ```

2. **Edit .env with your credentials:**
   ```env
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your-secret
   OPENAI_API_KEY=sk-...
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   SENDGRID_API_KEY=SG....
   SENDGRID_FROM_EMAIL=noreply@...
   ```

## 🎯 Deploy to Render

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create repo on GitHub and push
   ```

2. **Create Web Service on Render.com:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add all environment variables from `.env`

3. **Your API will be live at:** `https://scamshield-backend.onrender.com`

## ✅ Test
Visit: `https://your-render-url.onrender.com/api/test`

## 🔒 Note
Update `FRONTEND_URL` when you deploy your frontend.

