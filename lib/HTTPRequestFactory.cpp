
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

    stringstream ss;
    ss << result;
    response.setChunkedTransferEncoding(true);
    response.setContentType("text/plain");
    response.sendBuffer(ss.str().c_str(), ss.str().size());
}

void ParserRequestHandler::handleRequest(
    HTTPServerRequest& request, 
    HTTPServerResponse& response)
{
    HTMLForm form(request);
    auto url = form.get("url", "");
    auto result = "hello world from the parser";

     stringstream ss;
    ss << result;
    response.setChunkedTransferEncoding(true);
    response.setContentType("text/plain");
    response.sendBuffer(ss.str().c_str(), ss.str().size());
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