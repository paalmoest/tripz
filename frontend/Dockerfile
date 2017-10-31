FROM node:7.10.1
ENV PORT=80
COPY src /app
WORKDIR /app
RUN npm install
RUN npm run build
CMD npm run server