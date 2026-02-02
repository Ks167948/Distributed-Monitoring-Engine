const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// 1. Load the "Contract" (.proto file)
const packageDefinition = protoLoader.loadSync('monitor.proto', {});
const monitorProto = grpc.loadPackageDefinition(packageDefinition).monitor;

// 2. Define what happens when an Agent sends data
function streamMetrics(call, callback) {
    console.log("Agent connected! Receiving data stream...");

    // This 'call' object is a readable stream
    call.on('data', (report) => {
        console.log(`[${report.host_name}] CPU: ${report.cpu_usage.toFixed(2)}% | RAM: ${report.mem_usage.toFixed(2)}%`);
    });

    call.on('end', () => {
        // Send back a "Receipt" when the agent finishes
        callback(null, { status: "Success" });
        console.log("Agent disconnected.");
    });
}

// 3. Start the Server
function main() {
    const server = new grpc.Server();
    
    // Link the 'MonitorService' from the .proto to our function
    server.addService(monitorProto.MonitorService.service, {
        streamMetrics: streamMetrics
    });

    const address = '0.0.0.0:50051';
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
        console.log(`Collector Server running at ${address}`);
        server.start();
    });
}

main();