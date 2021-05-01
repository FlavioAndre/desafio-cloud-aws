package com.desafio.configuration;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import io.micrometer.core.instrument.util.StringUtils;
import org.socialsignin.spring.data.dynamodb.repository.config.EnableDynamoDBRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableDynamoDBRepositories(basePackages = "com.desafio.data.repositories")
@ConfigurationProperties(
        prefix = "amazon.dynamodb"
)
public class DynamoDBConfig {

    private String endpoint;

    @Autowired
    private ApplicationContext context;

    @Bean
    public AmazonDynamoDB amazonDynamoDB() {
        AWSCredentials awsCredentials = context.getBean("amazonCredential", AWSCredentials.class);

        AmazonDynamoDB amazonDynamoDB  = new AmazonDynamoDBClient(awsCredentials);

        if (!StringUtils.isEmpty(endpoint)) {
            amazonDynamoDB.setEndpoint(endpoint);
        }

        return amazonDynamoDB;
    }
}
