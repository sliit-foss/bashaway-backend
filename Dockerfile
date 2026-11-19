FROM node:24-alpine

WORKDIR /app

COPY . .

RUN npm i -g pnpm@10.34.9

RUN pnpm install --ignore-scripts --frozen-lockfile
RUN pnpm build

CMD ["node", "dist/app.js"]

EXPOSE 3000