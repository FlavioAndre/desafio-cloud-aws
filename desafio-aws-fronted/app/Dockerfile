FROM  node:alpine@sha256:27f59bdb682924beb511bb54241c4bebc79bfb3d66ad1c116b7ab2a04be38742 as build

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

FROM nginx:1.20.0-alpine@sha256:55684c622b7b62045bd4578e402704bdd1923f6ab704f57134e712c2f1da48c8
WORKDIR /app

RUN apk add dumb-init

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /app/src
EXPOSE 80

CMD ["dumb-init", "nginx", "-g", "daemon off;"]