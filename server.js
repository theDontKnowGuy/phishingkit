const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Helper function to log events
function logEvent(username, page, action, additionalData = {}) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        username: username || 'unknown',
        page,
        action,
        ip: additionalData.ip,
        userAgent: additionalData.userAgent,
        ...additionalData
    };

    const logFile = path.join(logsDir, 'training_log.json');

    // Read existing logs or create empty array
    let logs = [];
    if (fs.existsSync(logFile)) {
        try {
            const data = fs.readFileSync(logFile, 'utf8');
            logs = JSON.parse(data);
        } catch (err) {
            console.error('Error reading log file:', err);
        }
    }

    logs.push(logEntry);

    // Write back to file
    try {
        fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    } catch (err) {
        console.error('Error writing to log file:', err);
    }

    console.log('Logged event:', logEntry);
}

// API Routes
app.post('/api/log', (req, res) => {
    const { username, page, action, additionalData } = req.body;

    logEvent(username, page, action, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        ...additionalData
    });

    res.json({ success: true });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gift-selection.html'));
});

// API to get logs (for admin purposes)
app.get('/api/logs', (req, res) => {
    const logFile = path.join(logsDir, 'training_log.json');

    if (fs.existsSync(logFile)) {
        try {
            const data = fs.readFileSync(logFile, 'utf8');
            const logs = JSON.parse(data);
            res.json(logs);
        } catch (err) {
            res.status(500).json({ error: 'Error reading logs' });
        }
    } else {
        res.json([]);
    }
});

app.listen(PORT, () => {
    console.log(`Phishing training server running on port ${PORT}`);
    console.log(`Access the app at: http://localhost:${PORT}`);
}); 