# 🚀 Distributed System Monitoring Engine

> A high-performance, real-time observability system that streams hardware telemetry from C++ edge agents to a central Node.js collector using gRPC and Redis.

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-C%2B%2B%20%7C%20Node.js%20%7C%20gRPC%20%7C%20Redis-blue)

## 📖 Overview
This project is a full-stack distributed system designed to monitor the health (CPU & RAM usage) of remote servers in real-time. It demonstrates the implementation of **Google's gRPC protocol** for low-latency communication between low-level system languages (C++) and high-level backend runtimes (Node.js).

Unlike standard HTTP REST APIs, this system uses **HTTP/2 streaming** to maintain a persistent connection, allowing for millisecond-level updates without the overhead of repeated TCP handshakes.

## 🏗️ Architecture
**[ C++ Agent ]** --(gRPC Stream)--> **[ Node.js Collector ]** --(Write)--> **[ Redis Database ]** --(Read)--> **[ Live Dashboard ]**

* **Agent (C++):** Reads raw system metrics from the Linux `/proc` filesystem and streams them as Protocol Buffers.
* **Collector (Node.js):** A gRPC server that handles concurrent streams, performs data transformation, and acts as a write-through cache.
* **Storage (Redis):** Persists time-series data using Lists, ensuring recent history is always available.
* **Dashboard (CLI):** A real-time visualization tool that polls Redis for the latest cluster health metrics.

## 🛠️ Technical Highlights & Challenges Solved
### 1. Cross-Language Serialization
* **Challenge:** Integrating C++ (statically typed) with Node.js (dynamically typed) caused serialization conflicts where snake_case Protobuf fields (`host_name`) were automatically converted to camelCase (`hostName`) by the gRPC loader, causing data to be labeled as `undefined`.
* **Solution:** Implemented a robust schema-mapping layer in the Node.js interceptor to normalize field names before persistence, ensuring 100% data integrity.

### 2. High-Throughput Stream Handling
* **Challenge:** Managing persistent connections from agents without blocking the Node.js event loop.
* **Solution:** Utilized Node.js native `EventEmitter` patterns to handle gRPC data chunks asynchronously, allowing the collector to scale to multiple concurrent agents.

### 3. Efficient Time-Series Storage
* **Challenge:** Storing indefinite metrics would eventually crash the database memory.
* **Solution:** implemented a **Circular Buffer** pattern using Redis `LTRIM`. The database automatically prunes records older than the last 50 entries, maintaining a constant O(1) memory footprint per agent.

## 💻 Tech Stack
* **Core Protocol:** gRPC (Protocol Buffers v3)
* **Edge Agent:** C++ (Standard Library, file I/O)
* **Backend Server:** Node.js (Dynamic gRPC loading)
* **Database:** Redis (In-memory data structure store)
* **Environment:** Linux / WSL (Ubuntu)

## 🚀 How to Run locally

### Prerequisites
* C++ Compiler (`g++`)
* Node.js & npm
* Redis Server (`sudo apt install redis-server`)
* Protobuf Compiler (`protoc`)

### 1. Start the Infrastructure
Start the Redis database in the background:
```bash
sudo service redis-server start
```
### 2. Run the Collector (Server)
Install dependencies and start the Node.js server:

```bash
npm install
node server.js
# Output: Collector running at 0.0.0.0:50051
```
### 3. Compile & Run the Agent (Client)
Open a new terminal. Compile the C++ code and start the agent:

```bash
make clean && make
./agent
# Output: Heartbeat sent to Collector...
```
### 4. Launch the Dashboard
Open a third terminal to visualize the data live:

```bash
node dashboard.js
```
## 📸 Demo
(Insert your screenshot of the dashboard table here)

## 👨‍💻 Author
Kishor Software Engineer | Backend Systems Enthusiast [[Link to your LinkedIn](https://www.linkedin.com/in/kishor-solanki-507514285/)]
