FROM  node:alpine@sha256:a0b0b278ee42a452807b49f7a6f81686e44ed3d0d5af82abd883cf8d9a05bdde as build

ARG REACT_APP_USERPOOL_ID
ARG REACT_APP_CLIENT_ID
ARG REACT_APP_BASE_URL
ARG NODE_ENV

ENV REACT_APP_USERPOOL_ID=$REACT_APP_USERPOOL_ID
ENV REACT_APP_CLIENT_ID=$REACT_APP_CLIENT_ID
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
ENV NODE_ENV=$NODE_ENV

WORKDIR /app
COPY . .

RUN npm ci --only=production
RUN npm run build

FROM nginx:1.20.0-alpine@sha256:6a34c7040988e67430332557c1ff7de65668609cda80203043b634e3c80f265e
WORKDIR /app

RUN apk add dumb-init

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /app/src
EXPOSE 80

CMD ["dumb-init", "nginx", "-g", "daemon off;"]