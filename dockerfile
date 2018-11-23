# Stage 1: Build the application
# docker build -t crowds-cure/cancer:latest .
FROM node:11.2.0-slim as builder

RUN apt-get update && apt-get install -y git
RUN mkdir /usr/src/app
RUN npm install react-scripts -g

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm install

ADD . /usr/src/app
ADD public /usr/src/app/public
RUN npm run build

# Stage 2: Bundle the built application into a Docker container
# which runs Nginx using Alpine Linux
FROM nginx:1.15.5-alpine
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]