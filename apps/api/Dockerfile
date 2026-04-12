FROM node:22-bookworm-slim

ENV NODE_ENV=production
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /workspace

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @portfolio-tq/api... build

EXPOSE 8080

CMD ["node", "apps/api/dist/index.js"]
