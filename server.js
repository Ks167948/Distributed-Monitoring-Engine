const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const redis = require('redis');

// 1. Connect to Redis
const redisClient = redis.createClient();
redisClient.connect().then(() => console.log("Connected to Redis database!"));

const packageDefinition = protoLoader.loadSync('monitor.proto', {});
const monitorProto = grpc.loadPackageDefinition(packageDefinition).monitor;

async function streamMetrics(call, callback) {
    console.log(">>> [NETWORK] Agent has connected to the stream.");

    call.on('data', async (report) => {
        // FIX: Ensure we get a string even if host_name is missing or renamed
        const host = report.host_name || report.hostname || "Unknown-Host";
        
        console.log(`>>> [RECEIVE] Got packet from: ${host}`);
        
        try {
            const dataPoint = JSON.stringify({
                cpu: report.cpu_usage,
                mem: report.mem_usage,
                time: new Date().toISOString()
            });

            // Save to Redis using the resolved host variable
            const listSize = await redisClient.lPush(`metrics:${host}`, dataPoint);
            console.log(`>>> [REDIS] Successfully saved. Total entries for ${host}: ${listSize}`);
            
            await redisClient.lTrim(`metrics:${host}`, 0, 49);
        } catch (err) {
            console.error("!!! [REDIS ERROR]:", err);
        }
    });

    call.on('end', () => {
        console.log(">>> [NETWORK] Agent finished streaming.");
        callback(null, { status: "Success" });
    });

    call.on('error', (err) => {
        console.error("!!! [STREAM ERROR]:", err);
    });
}

const server = new grpc.Server();
server.addService(monitorProto.MonitorService.service, { streamMetrics });

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log("Collector running at 0.0.0.0:50051");
    server.start();
});