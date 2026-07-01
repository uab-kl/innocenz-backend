# Copy lockfile
COPY package.json pnpm-lock.yaml* ./

# pnpm v10+ — allow native builds
RUN pnpm install --frozen-lockfile \
  --config.onlyBuiltDependencies[]=bcrypt \
  --config.onlyBuiltDependencies[]=esbuild \
  --config.onlyBuiltDependencies[]=@apollo/protobufjs

RUN pnpm build

# runner stage
EXPOSE 7780

HEALTHCHECK --interval=30s --timeout=30s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://localhost:7780/api/v1/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/main.js"]