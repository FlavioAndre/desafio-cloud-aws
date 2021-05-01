package com.desafio.lambda;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.AWSLambda;
import com.amazonaws.services.lambda.AWSLambdaClientBuilder;
import com.amazonaws.services.lambda.invoke.LambdaInvokerFactory;
import com.desafio.cognito.AuthenticationFacade;
import com.desafio.lambda.model.RequisicaoInput;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

@Service
public class AWSLambdaService {
    @Autowired
    private AuthenticationFacade authenticationFacade;

    @Autowired
    private ApplicationContext context;

    public void getInteracoes(String email) {

        AWSCredentials awsCredentials = context.getBean("amazonCredential", AWSCredentials.class);

        AWSLambda lambda = AWSLambdaClientBuilder
                .standard()
                .withRegion(Regions.US_EAST_1)
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();

        final AuditoriaService auditoriaService = LambdaInvokerFactory.builder()
                .lambdaClient(lambda)
                .build(AuditoriaService.class);

        RequisicaoInput input = new RequisicaoInput(authenticationFacade.getUserName(),email);
        auditoriaService.getInteracoes(input);
    }
}
