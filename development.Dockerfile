# Use with:
# docker build -f development.Dockerfile -t crowds-cure/cancer:dev-latest .

FROM node:11.2.0-slim

RUN apt-get update && apt-get install -y git
RUN mkdir /usr/src/app
RUN npm install react-scripts -g --silent

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
ADD . /usr/src/app/
ADD public /usr/src/app/public

WORKDIR /usr/src/app

ENV NODE_ENV='development'
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]