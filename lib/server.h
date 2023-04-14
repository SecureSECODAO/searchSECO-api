#pragma once

#include <string>
#include <Poco/Net/HTTPServer.h>

class Server
{
    public:
        Server(std::string ip, int port);
        void listen();

    protected:
        std::string ip;
        int port;
        HTTPServer* server;
};