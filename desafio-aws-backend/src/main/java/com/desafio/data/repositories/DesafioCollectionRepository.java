package com.desafio.data.repositories;


import com.desafio.data.model.DesafioCollection;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

@EnableScan
public interface DesafioCollectionRepository extends CrudRepository<DesafioCollection, String> {
    Optional<DesafioCollection> findById(String id);
    Page<DesafioCollection> findByUserName(final String userName, final Pageable pageRequest);
}
