package com.desafio.lambda;

import com.amazonaws.services.lambda.invoke.LambdaFunction;
import com.desafio.lambda.model.RequisicaoInput;

public interface AuditoriaService {
    @LambdaFunction(functionName="Desafio_GetInteracoes")
    void getInteracoes(RequisicaoInput input);
}
