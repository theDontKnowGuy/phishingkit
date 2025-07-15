# Phishing Training Kit

A realistic phishing simulation webapp for security awareness training. This tool helps educate employees about phishing attacks through a hands-on simulation experience.

## 🎯 Features

- **Realistic Holiday Gift Selection Page**: Convincing landing page that mimics company holiday programs
- **Fake Google Authentication**: Highly realistic Google sign-in page that captures user behavior
- **Educational Reveal Page**: Comprehensive training content explaining the simulation and best practices
- **Comprehensive Logging**: Tracks user interactions at every step for training analytics
- **Mobile Responsive**: Works seamlessly on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
npm start
```

3. **For development with auto-restart:**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📧 Setting Up Email Links

When sending phishing training emails to employees, use URLs in this format:

```
http://your-server.com/?user=john.smith
```

Or with full email:
```
http://your-server.com/?user=john.smith@company.com
```

The username parameter will be:
- Displayed in the fake Google authentication page
- Logged for tracking purposes
- Used to identify who completed the training

## 📊 Viewing Training Results

### Admin Log Viewer
Access the admin interface at:
```
http://localhost:3000/admin.html
```

### API Endpoints
- `GET /api/logs` - Retrieve all training logs in JSON format
- `POST /api/log` - Log a new event (used by frontend)

### Log Data Structure
Each log entry contains:
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "username": "john.smith",
  "page": "gift_selection",
  "action": "page_view",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "url": "http://localhost:3000/?user=john.smith"
}
```

## 🔍 Tracked Events

### Page Views
- `gift_selection` - User landed on holiday gift page
- `google_auth` - User reached fake Google sign-in
- `training_reveal` - User saw the educational reveal

### User Actions
- `button_click` - Authentication button clicked
- `password_entered` - User started typing password
- `form_submit` - User submitted login form
- `completed_reading` - User spent 30+ seconds on reveal page

## 🎭 Simulation Flow

1. **Email Link**: Employee receives email with personalized link
2. **Gift Selection**: Convincing holiday gift selection page
3. **Authentication**: Realistic Google sign-in page with pre-filled username
4. **Password Entry**: Any password triggers the reveal
5. **Education**: Comprehensive explanation and security tips

## 🔧 Customization

### Modifying the Gift Selection Page
Edit `public/gift-selection.html` to change:
- Gift options and descriptions
- Company branding
- Holiday themes

### Customizing the Google Page
Edit `public/google-auth.html` to adjust:
- Username format (currently uses @company.com)
- Visual appearance
- Form behavior

### Educational Content
Modify `public/training-reveal.html` to:
- Add company-specific security policies
- Include contact information for IT security
- Customize training tips

## 📁 Project Structure

```
phishing-training-kit/
├── server.js              # Express server with logging
├── package.json           # Dependencies and scripts
├── public/                # Static web files
│   ├── css/
│   │   └── styles.css     # Complete styling
│   ├── js/
│   │   └── logger.js      # Client-side logging
│   ├── gift-selection.html # Landing page
│   ├── google-auth.html   # Fake authentication
│   ├── training-reveal.html # Educational reveal
│   └── admin.html         # Log viewing interface
└── logs/                  # Training logs (auto-created)
    └── training_log.json  # JSON log file
```

## 🔒 Security Considerations

- **No Real Passwords**: The system never stores actual passwords
- **Local Logging**: All logs are stored locally in JSON format
- **IP Tracking**: Only logs IP addresses for session tracking
- **Privacy**: Logs include username but not actual password content

## 📈 Analytics & Reporting

The system tracks several key metrics:
- **Completion Rate**: How many users complete the full simulation
- **Fall-Through Rate**: Percentage who enter passwords
- **Time Metrics**: How long users spend on each page
- **Behavior Patterns**: Click-through and interaction data

## 🛠️ Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables
- `PORT` - Server port (default: 3000)

## 🤝 Contributing

This is a security training tool. When contributing:
1. Test thoroughly to ensure realistic simulation
2. Keep educational content current with security best practices
3. Maintain logging accuracy for training metrics

## ⚠️ Disclaimer

This tool is designed for **legitimate security training purposes only**. It should only be used:
- With proper authorization from your organization
- As part of approved security awareness programs
- With clear disclosure that it's a training simulation
- In compliance with your organization's security policies

Misuse of this tool for actual phishing attacks is illegal and unethical.

## 📞 Support

For questions about implementing this training program:
1. Review the educational content in the reveal page
2. Check the logging system for completeness
3. Test the full user flow before deployment
4. Ensure proper email communication about the training program 