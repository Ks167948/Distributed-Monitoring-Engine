#include <iostream>
#include <fstream>
#include <string>
#include <memory>
#include <unistd.h>
#include <grpcpp/grpcpp.h>
#include "monitor.grpc.pb.h"

using grpc::Channel;
using grpc::ClientContext;
using grpc::ClientWriter;
using monitor::MonitorService;
using monitor::MetricReport;
using monitor::Ack;

// Function to get CPU usage
double get_cpu_usage() {
    std::ifstream file("/proc/loadavg");
    double load;
    file >> load; // Simple version for testing
    return load * 10.0; 
}

// Function to get Memory usage
double get_mem_usage() {
    std::string label;
    long total, free;
    std::ifstream file("/proc/meminfo");
    file >> label >> total >> label;
    file >> label >> free >> label;
    return (1.0 - (double)free / total) * 100.0;
}

int main() {
    auto channel = grpc::CreateChannel("localhost:50051", grpc::InsecureChannelCredentials());
    auto stub = MonitorService::NewStub(channel);

    ClientContext context;
    Ack ack;

    // Open the pipe
    std::unique_ptr<ClientWriter<MetricReport>> writer(stub->StreamMetrics(&context, &ack));

    if (!writer) {
        std::cout << "Failed to open stream!" << std::endl;
        return 1;
    }

    std::cout << "Monitoring Active. Sending heartbeats..." << std::endl;

    while (true) {
        MetricReport report;
        report.set_host_name("Kishor-PC");
        report.set_cpu_usage(get_cpu_usage());
        report.set_mem_usage(get_mem_usage());

        if (!writer->Write(report)) {
            std::cout << "Stream broken!" << std::endl;
            break;
        }

        std::cout << ">>> Heartbeat sent to Collector..." << std::endl;
        sleep(2); // Send every 2 seconds
    }

    writer->WritesDone();
    writer->Finish();
    return 0;
}