FROM ubuntu:18.04
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN apt-get update && apt-get install -y python3.6 python3-pip python3-dev
RUN cd /tmp \
	&& apt-get install -y wget \
	&& wget https://dl.google.com/go/go1.14.linux-amd64.tar.gz \
	&& tar -xvf go1.14.linux-amd64.tar.gz \
	&& mv go /usr/local 
	# && export GOROOT=/usr/local/go \
	# && export GOPATH=$HOME/go \
	# && export PATH=$GOPATH/bin:$GOROOT/bin:$PATH 

ENV GOROOT /usr/local/go
ENV GOPATH $HOME/go
ENV PATH $GOPATH/bin:$GOROOT/bin:$PATH
RUN go version
RUN apt-get install -y curl \
	&& cd ~ \
	&& curl -sL https://deb.nodesource.com/setup_10.x | bash - \
	&& apt install -y nodejs
RUN apt update && apt-get install -y build-essential

WORKDIR /app
COPY /backend ./backend
COPY /frontend ./frontend

RUN apt-get update
RUN cd backend/go-service \
	&& apt-get install -y libzmq3-dev git pkg-config\
	&& go get github.com/pebbe/zmq4 

RUN	cd backend/python-service \
	&& pip3 install -r requirements.txt 

RUN cd frontend \
	&& npm install 

WORKDIR /app
EXPOSE 3000 5000

CMD (cd frontend && node server.js & ) && (cd backend/go-service && go run app.go &) && (cd backend/python-service && python3 app.py)

