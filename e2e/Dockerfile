FROM mcr.microsoft.com/playwright:v1.58.1-noble

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV CI=true
ENV DOCKER_ENV=true

CMD ["npx", "playwright", "test"]
