LDFLAGS = -L/usr/local/lib `pkg-config --libs grpc++ grpc` \
           -lprotobuf -lpthread -ldl

all: agent

monitor.pb.cc: monitor.proto
	protoc --cpp_out=. monitor.proto

monitor.grpc.pb.cc: monitor.proto
	protoc --grpc_out=. --plugin=protoc-gen-grpc=`which grpc_cpp_plugin` monitor.proto

agent: agent.cpp monitor.pb.cc monitor.grpc.pb.cc
	g++ -std=c++11 agent.cpp monitor.pb.cc monitor.grpc.pb.cc -o agent $(LDFLAGS)

clean:
	rm -f *.o *.pb.cc *.pb.h agent