

#include <string>
#include <iostream>
#include "server.h"
#include "HTTPRequestFactory.h"
#include <Poco/Net/HTTPServer.h>
#include "HTTPRequestFactory.h"


Server::Server(std::string ip, int port)
{
    this->ip = ip;
    this->port = port;
    this->server = new HTTPServer(new RequestHandlerFactory, ServerSocket(port), new HTTPServerParams);
}

void Server::listen()
{
    std::cout << "Starting server on port " << this->ip << std::endl;
    server->start();
}