#pragma once

#include <Poco/Net/HTTPRequestHandlerFactory.h>
#include <Poco/Net/HTTPRequestHandler.h>
#include <Poco/Net/HTTPServerRequest.h>
#include <Poco/Net/HTTPServerResponse.h>

using namespace Poco::Net;


class RequestHandlerFactory: public HTTPRequestHandlerFactory
{
    public:
        virtual HTTPRequestHandler* createRequestHandler(
            const HTTPServerRequest& request
        );
};

class SpiderRequestHandler: public HTTPRequestHandler
{
    public:
        void handleRequest(
            HTTPServerRequest& request, 
            HTTPServerResponse& response
        );
};

class ParserRequestHandler: public HTTPRequestHandler
{
    public:
        void handleRequest(
            HTTPServerRequest& request, 
            HTTPServerResponse& response
        );
};
