

#include "server.h"

#define API_IP "127.0.0.1"
#define API_PORT 8080

int main(int argc, char* argv[]) 
{
    Server server(API_IP, API_PORT);

    server.listen();

    return 0;
}