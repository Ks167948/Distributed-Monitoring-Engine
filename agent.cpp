#include <iostream>
#include <memory>
#include <string>
#include <grpcpp/grpcpp.h>
#include "monitor.grpc.pb.h" // The file we generated!

using grpc::Channel;
using grpc::ClientContext;
using grpc::Status;
using monitor::MonitorService;
using monitor::MetricReport;
using monitor::Ack;

class MonitorClient {
public:
    MonitorClient(std::shared_ptr<Channel> channel)
        : stub_(MonitorService::NewStub(channel)) {}

    // This function sends a single report to the server
    void SendMetrics(double cpu, double mem) {
        MetricReport report;
        report.set_host_name("Kishor-PC");
        report.set_cpu_usage(cpu);
        report.set_mem_usage(mem);

        Ack response;
        ClientContext context;

        // In the next step, we'll make this a real stream,
        // but let's start with a simple call to test the connection.
        // Status status = stub_->StreamMetrics(&context, &report, &response);
        std::cout << "Packet Ready: CPU " << cpu << "% RAM " << mem << "%" << std::endl;
    }

private:
    std::unique_ptr<MonitorService::Stub> stub_;
};

int main() {
    // We'll tell the agent to look for the server on "localhost:50051"
    MonitorClient client(grpc::CreateChannel("localhost:50051", grpc::InsecureChannelCredentials()));
    
    std::cout << "Agent is running. Searching for server..." << std::endl;
    
    // For now, let's just print that we are ready to send
    client.SendMetrics(15.5, 45.0); 

    return 0;
}