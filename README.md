Distributed Real-Time Observability Engine
A high-performance monitoring system that tracks system-level metrics (CPU and RAM) from multiple distributed nodes using a C++ agent and a centralized Node.js collector.

🚀 Overview
This project demonstrates the ability to bridge low-level systems programming with scalable backend architecture. It utilizes gRPC for efficient, binary-based data streaming between services written in different languages.

🛠️ Technical Stack

Agent (Edge): C++ 


Collector (Server): Node.js 


Communication: gRPC & Protocol Buffers (protobuf) 

Environment: Linux / WSL2

Build System: Makefile

✨ Key Features (Implemented)
Low-Footprint Monitoring: The C++ agent parses the Linux /proc filesystem (specifically /proc/stat and /proc/meminfo) to capture real-time telemetry with minimal memory overhead.

Cross-Language Communication: Implemented a strict communication contract using a .proto definition, allowing a C++ client to stream data to a JavaScript server.

Real-Time Data Ingestion: The Node.js server utilizes an asynchronous event-driven model to handle concurrent data reports from multiple monitoring agents.

High Efficiency: Used gRPC's binary serialization over HTTP/2, significantly reducing network bandwidth compared to traditional JSON/REST APIs.

🏗️ Architecture
The Edge Agent (C++): A lightweight binary that performs differential calculations on CPU "jiffies" and memory snapshots.

The Collector (Node.js): A centralized server that listens on port 50051 to ingest, validate, and display incoming telemetry.

The Contract: A monitor.proto file that ensures strong typing and performance-optimized data transfer.

🚦 How to Run
Prerequisites
Linux/WSL2 environment

gRPC and Protobuf C++ libraries

Node.js & npm

Steps
Compile the Agent:

Bash
make
Start the Collector:

Bash
node server.js
Run the Agent:

Bash
./agent
📈 Roadmap (Future Improvements)
[ ] Redis Integration: For low-latency time-series data storage.

[ ] Persistence Layer: Moving historical data from Redis to MongoDB.

[ ] Dashboard: A React-based real-time visualizer using WebSockets.

[ ] Alerting Engine: Threshold-based notifications for critical system spikes.
