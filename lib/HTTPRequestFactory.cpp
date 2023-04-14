
#include "HTTPRequestFactory.h"
#include <Poco/Net/HTMLForm.h>
#include <sstream>
#include <iostream>


void SpiderRequestHandler::handleRequest(
    HTTPServerRequest& request, 
    HTTPServerResponse& response)
{
    HTMLForm form(request);
    auto url = form.get("url", "");
    auto result = "hello world from the spider";


}

void ParserRequestHandler::handleRequest(
    HTTPServerRequest& request, 
    HTTPServerResponse& response)
{
    HTMLForm form(request);
    auto url = form.get("url", "");
    auto result = "hello world from the spider";
}

HTTPRequestHandler* RequestHandlerFactory::createRequestHandler(const HTTPServerRequest& request)
{
    auto endpoint = request.getURI();
    if (endpoint == "/spider")
        return new SpiderRequestHandler();
    else if (endpoint == "/parser")
        return new ParserRequestHandler();
    return nullptr;
}