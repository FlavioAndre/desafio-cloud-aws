package com.desafio.data.services;

import com.desafio.cognito.AuthenticationFacade;
import com.desafio.data.model.DesafioCollection;
import com.desafio.data.repositories.DesafioCollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class DesafioCollectionService {

    private static final int PAGE_SIZE = 10;

    @Autowired
    private AuthenticationFacade authenticationFacade;

    @Autowired
    private DesafioCollectionRepository repository;

    public Page<DesafioCollection> findByUserName(final Integer  page) {
        return repository.findByUserName(authenticationFacade.getUserName(), PageRequest.of(page, PAGE_SIZE));
    }
}
