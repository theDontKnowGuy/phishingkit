const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['SMTP_USER', 'SMTP_PASS', 'PHISHING_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\n💡 Create a .env file with the following variables:');
    console.error('   SMTP_USER=your-email@gmail.com');
    console.error('   SMTP_PASS=your-app-password');
    console.error('   PHISHING_URL=https://your-heroku-app.herokuapp.com');
    process.exit(1);
}

// Gmail SMTP Configuration from environment variables
const gmailConfig = {
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};

// Create transporter
const transporter = nodemailer.createTransport(gmailConfig);

// Email HTML template styled like gift-selection.html
function createEmailTemplate(recipientEmail) {
    const phishingLink = `${process.env.PHISHING_URL}?user=${encodeURIComponent(recipientEmail)}`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Holiday Gift Selection 2024 - Company Portal</title>
    <style>
        /* Inline styles for email compatibility */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .gift-header {
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
        }
        
        .gift-header h1 {
            font-size: 2.2rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .gift-header p {
            font-size: 1.1rem;
            opacity: 0.9;
            margin: 5px 0;
        }
        
        .user-email {
            color: #ffd700;
            font-weight: bold;
        }
        
        .content {
            padding: 30px;
        }
        
        .gift-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .gift-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            border: 1px solid #e2e8f0;
        }
        
        .gift-icon {
            font-size: 3rem;
            margin-bottom: 15px;
        }
        
        .gift-card h3 {
            font-size: 1.2rem;
            margin-bottom: 8px;
            color: #4a5568;
        }
        
        .gift-card p {
            color: #718096;
            font-size: 0.9rem;
        }
        
        .cta-section {
            text-align: center;
            color: white;
            margin: 30px 0;
            padding: 20px;
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-radius: 10px;
        }
        
        .auth-button {
            background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            font-size: 1.1rem;
            border-radius: 50px;
            display: inline-block;
            box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
            font-weight: bold;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            color: #718096;
            font-size: 0.9rem;
            border-top: 1px solid #e2e8f0;
        }
        
        .urgent {
            background: #fed7d7;
            border: 1px solid #fc8181;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #c53030;
            text-align: center;
            font-weight: bold;
        }
        
        @media (max-width: 600px) {
            .gift-grid {
                grid-template-columns: 1fr;
            }
            .gift-header h1 {
                font-size: 1.8rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="gift-header">
            <div style="margin-bottom: 20px;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="40" viewBox="0 0 44 40" width="44" style="filter: invert(1);">
                    <path clip-rule="evenodd" d="M16.6288 11.0658C17.9861 9.91421 18.8474 8.19661 18.8474 6.27798C18.8474 2.81075 16.0346 0 12.5649 0C9.0952 0 6.28245 2.81075 6.28245 6.27798C6.28245 9.74522 9.0952 12.556 12.5649 12.556C13.417 12.556 14.2294 12.3865 14.9703 12.0794L16.6646 15.6537C16.0682 16.1663 15.5983 16.8218 15.3082 17.5671L8.69633 16.0751C8.69796 16.0291 8.69878 15.9828 8.69878 15.9364C8.69878 13.8027 6.96786 12.073 4.83266 12.073C2.69745 12.073 0.966531 13.8027 0.966531 15.9364C0.966531 18.0701 2.69745 19.7998 4.83266 19.7998C6.23757 19.7998 7.46746 19.0509 8.14441 17.9309L14.9837 19.4742C15.0028 20.0686 15.1293 20.6359 15.3446 21.1573L11.2795 24.204C10.1317 22.7011 8.32039 21.7315 6.28245 21.7315C2.81275 21.7315 0 24.5422 0 28.0095C0 31.4767 2.81275 34.2874 6.28245 34.2874C9.75216 34.2874 12.5649 31.4767 12.5649 28.0095C12.5649 27.2776 12.4396 26.5749 12.2092 25.9218L16.4264 22.7611C17.2985 23.6177 18.4945 24.1461 19.8139 24.1461C20.0256 24.1461 20.2341 24.1325 20.4386 24.1061L22.3708 31.8293C21.1381 32.4751 20.2972 33.766 20.2972 35.2533C20.2972 37.387 22.0281 39.1167 24.1633 39.1167C26.2985 39.1167 28.0294 37.387 28.0294 35.2533C28.0294 33.1498 26.3471 31.439 24.2537 31.3909L22.2733 23.4748C23.1426 22.9603 23.8366 22.1812 24.2444 21.2486H30.464C30.7108 24.4901 33.4211 27.0436 36.7282 27.0436C40.1979 27.0436 43.0106 24.2329 43.0106 20.7656C43.0106 17.2984 40.1979 14.4877 36.7282 14.4877C33.7575 14.4877 31.2683 16.5481 30.6138 19.3169H24.6465C24.6465 18.5861 24.4841 17.8932 24.1933 17.2723L29.6393 11.8302C30.2742 12.2869 31.0534 12.556 31.8955 12.556C34.0307 12.556 35.7617 10.8263 35.7617 8.69259C35.7617 6.55891 34.0307 4.82922 31.8955 4.82922C29.7603 4.82922 28.0294 6.55891 28.0294 8.69259C28.0294 9.28166 28.1613 9.83993 28.3973 10.3395L23.0251 15.7079C22.1714 14.9488 21.0465 14.4877 19.8139 14.4877C19.3061 14.4877 18.8165 14.5659 18.3567 14.711L16.6288 11.0658Z" fill="#FD339F" fill-rule="evenodd"/>
                </svg>
            </div>
            <h1>🎁 Rosh Hashana 2025 PathID Gift Survey</h1>
            <p>Hi <span class="user-email">${recipientEmail}</span>!</p>
            <p>Help us decide which kind of gifts to give this year!</p>
        </div>

        <div class="content">


            <div class="cta-section">
                <a href="${phishingLink}" class="auth-button">
                    Click to See Options and Vote!
                </a>
            </div>
        </div>

        <div class="footer">
            <p><strong>Important:</strong> Authentication required for security purposes.</p>
            <p><small>PathID Human Resources Department | Confidential Employee Communication</small></p>
        </div>
    </div>
</body>
</html>`;
}

// Function to send individual email
async function sendEmail(recipientEmail, delay = 2000) {
    try {
        const htmlContent = createEmailTemplate(recipientEmail);

        const mailOptions = {
            from: `"PathID HR Department" <${process.env.SMTP_USER}>`,
            to: recipientEmail,
            subject: '🎁 PathID Rosh Hashana 2025 Gift Selection - Action Required',
            html: htmlContent,
            headers: {
                'X-Priority': '1 (Highest)',
                'X-MSMail-Priority': 'High',
                'Importance': 'High'
            }
        };

        console.log(`📧 Sending email to: ${recipientEmail}`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${recipientEmail}`);
        console.log(`📋 Message ID: ${info.messageId}\n`);

        // Add delay between emails to avoid being flagged as spam
        if (delay > 0) {
            console.log(`⏳ Waiting ${delay}ms before next email...\n`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        return { success: true, email: recipientEmail, messageId: info.messageId };
    } catch (error) {
        console.error(`❌ Failed to send email to ${recipientEmail}:`, error.message);
        return { success: false, email: recipientEmail, error: error.message };
    }
}

// Function to send emails to a list
async function sendBulkEmails(emailList, delayBetweenEmails = 2000) {
    console.log(`🚀 Starting bulk email campaign to ${emailList.length} recipients...\n`);

    const results = {
        successful: [],
        failed: [],
        total: emailList.length
    };

    for (let i = 0; i < emailList.length; i++) {
        const email = emailList[i].trim();
        if (!email) continue;

        console.log(`📩 Processing email ${i + 1}/${emailList.length}`);
        const result = await sendEmail(email, delayBetweenEmails);

        if (result.success) {
            results.successful.push(result);
        } else {
            results.failed.push(result);
        }
    }

    // Print summary
    console.log('\n📊 CAMPAIGN SUMMARY:');
    console.log(`✅ Successful: ${results.successful.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);
    console.log(`📧 Total: ${results.total}`);

    if (results.failed.length > 0) {
        console.log('\n❌ Failed emails:');
        results.failed.forEach(fail => {
            console.log(`   - ${fail.email}: ${fail.error}`);
        });
    }

    return results;
}

// Example usage
async function main() {
    // Replace with your list of target emails
    const emailList = [
        // 'user1@company.com',
        // 'user2@company.com', 
        // 'user3@company.com'
        // Add your target emails here...
    ];

    // Verify transporter configuration
    try {
        await transporter.verify();
        console.log('✅ SMTP configuration verified');
    } catch (error) {
        console.error('❌ SMTP configuration error:', error.message);
        return;
    }

    // Send emails
    await sendBulkEmails(emailList, 3000); // 3 second delay between emails
}

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    sendEmail,
    sendBulkEmails,
    createEmailTemplate
}; 