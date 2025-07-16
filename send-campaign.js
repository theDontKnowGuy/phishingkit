const fs = require('fs');
require('dotenv').config();
const { sendBulkEmails } = require('./email-sender');

async function runCampaign() {
    try {
        // Read emails from text file
        const emailData = fs.readFileSync('targets.txt', 'utf8');
        const emailList = emailData
            .split('\n')
            .map(email => email.trim())
            .filter(email => email && email.includes('@'));

        if (emailList.length === 0) {
            console.error('❌ No valid emails found in targets.txt');
            return;
        }

        console.log(`📋 Found ${emailList.length} email addresses`);
        console.log('📧 Email list:');
        emailList.forEach((email, i) => console.log(`   ${i + 1}. ${email}`));

        // Confirm before sending
        console.log('\n⚠️  About to send phishing emails. Continue? (y/N)');

        // In real usage, you might want to add readline for confirmation
        // For now, just proceed after 3 seconds
        await new Promise(resolve => {
            console.log('Starting in 3 seconds...');
            setTimeout(resolve, 3000);
        });

        // Send the campaign
        const results = await sendBulkEmails(emailList, 5000); // 5 second delay

        // Save results
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const resultFile = `campaign-results-${timestamp}.json`;
        fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));
        console.log(`📄 Results saved to: ${resultFile}`);

    } catch (error) {
        console.error('❌ Campaign failed:', error.message);
    }
}

runCampaign(); 