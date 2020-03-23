FROM node:10

WORKDIR /logger
ADD . .
RUN yarn

ENTRYPOINT ["/logger/docker-entrypoint.sh"]
EXPOSE 50051
CMD ["--help"]
