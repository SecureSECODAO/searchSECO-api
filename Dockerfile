FROM ubuntu:focal
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get -y update && \
    apt-get -y dist-upgrade && \
    apt-get -y install gcc g++ cmake wget autoconf curl libcurl4-openssl-dev git libboost-date-time-dev libboost-regex-dev nlohmann-json3-dev libantlr4-runtime-dev libantlr4-runtime4.8 && \
	wget http://131.123.42.38/lmcrs/v1.0.0/srcml_1.0.0-1_ubuntu18.04.deb && \
    apt-get -y install ./srcml_1.0.0-1_ubuntu18.04.deb

RUN	apt-get install python3.9 python3-pip -y && \
	pip install conan && \
	conan profile detect --force && \
	mkdir api

COPY . ./api

RUN cd api && \
	mkdir build && \
	conan install . -s compiler.cppstd=17 --output-folder=build --build=missing && \
	cd build && \
	cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_tookchain.cmake -DCMAKE_BUILD_TYPE=Release && \
	cmake --build .

