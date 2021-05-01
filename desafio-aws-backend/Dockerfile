FROM openjdk:11-jre-slim

WORKDIR /desafioAws

EXPOSE 8081

MAINTAINER desafio.com

COPY target/desafio-aws-amcom-0.0.1-SNAPSHOT.jar /desafioAws/desafio-aws-amcom.jar

ENTRYPOINT ["java","-XX:+UseContainerSupport","-jar","/desafioAws/desafio-aws-amcom.jar"]