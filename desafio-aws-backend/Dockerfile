FROM maven:3.6.3-jdk-11-slim@sha256:68ce1cd457891f48d1e137c7d6a4493f60843e84c9e2634e3df1d3d5b381d36c AS build
RUN mkdir /project
COPY . /project
WORKDIR /project
RUN mvn clean package -DskipTests

FROM adoptopenjdk/openjdk11:jre-11.0.11_9-alpine@sha256:7efafc8190b160b10fe6371afb0cf46323d35074ac8461126e7a4eccecfbdda7 as builder2

RUN mkdir /application
COPY --from=build /project/target/desafio-aws-amcom-0.0.1-SNAPSHOT.jar /application/application.jar

WORKDIR application

RUN java -Djarmode=layertools -jar application.jar extract
RUN rm -f application.jar

FROM builder2 as builder3
RUN apk add dumb-init

WORKDIR application

EXPOSE 8081
MAINTAINER desafio.com

RUN addgroup --system javauser && adduser -S -s /bin/false -G javauser javauser

COPY --from=builder2 application/dependencies/ ./
COPY --from=builder2 application/spring-boot-loader/ ./
COPY --from=builder2 application/snapshot-dependencies/ ./
COPY --from=builder2 application/application/ ./

RUN chown -R javauser:javauser /application
USER javauser

ENTRYPOINT ["dumb-init", "java", "org.springframework.boot.loader.JarLauncher"]