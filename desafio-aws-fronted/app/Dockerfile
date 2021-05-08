FROM node:alpine as build

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
RUN yarn install
#RUN yarn add @types/file-saver
RUN yarn build
RUN rm -rf src/

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]