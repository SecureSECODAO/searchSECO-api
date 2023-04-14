cmake_minimum_required(VERSION 3.15)
project(secureseco_api)

find_package(POCO REQUIRED)

add_subdirectory(../lib ./lib)
add_subdirectory(../modules ./modules)

add_executable(${PROJECT_NAME} src/main.cpp)
target_link_libraries(${PROJECT_NAME} POCO::POCO)