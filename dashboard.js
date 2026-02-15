const redis = require('redis');

async function startDashboard() {
    const client = redis.createClient();
    await client.connect();

    console.clear();
    console.log("Waiting for stream...");

    setInterval(async () => {
        // Get the last 10 metrics from your specific key
        const rawData = await client.lRange('metrics:Kishor-PC', 0, 9);
        
        if (rawData.length === 0) return;

        // Convert the JSON strings into a clean table
        const tableData = rawData.map(entry => {
            const data = JSON.parse(entry);
            return {
                CPU: `${Number(data.cpu).toFixed(2)}%`,
                Memory: `${data.mem.toFixed(2)}%`,
                Time: data.time.split('T')[1].split('.')[0] // Show only HH:MM:SS
            };
        });

        console.clear();
        console.log(`=== MONITORING: Kishor-PC ===`);
        console.table(tableData);

    }, 1000); // Update every second
}

startDashboard();