FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm i -g pnpm@8.0.0

RUN pnpm install --ignore-scripts
RUN pnpm build

CMD ["node", "dist/app.js"]

EXPOSE 3000