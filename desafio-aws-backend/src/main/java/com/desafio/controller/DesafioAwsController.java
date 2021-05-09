package com.desafio.controller;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.desafio.cognito.AuthenticationFacade;
import com.desafio.controller.message.ResponseMessage;
import com.desafio.data.model.DesafioCollection;
import com.desafio.data.services.DesafioCollectionService;
import com.desafio.lambda.AWSLambdaService;
import com.desafio.s3.AWSS3Service;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@RestController
@ConfigurationProperties(
        prefix = "com.desafio.s3"
)
public class DesafioAwsController {

    @Autowired
    private AmazonDynamoDB amazonDynamoDB;

    @Autowired
    private DesafioCollectionService service;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private AWSS3Service awss3Service;

    @Autowired
    private AuthenticationFacade authenticationFacade;

    @Autowired
    private AWSLambdaService lambdaService;

    private static final Log logger = LogFactory.getLog(DesafioAwsController.class);

    @GetMapping(path = "/api/hello")
    public String getResp() {
        final String username = authenticationFacade.getUserName();
        return messageSource.getMessage("saudacao", new Object[]{username}, Locale.US);
    }

    @GetMapping(path = "/api/listAll")
    public Map<String, Object> getFiles(@RequestParam(name="nextContinuationToken", required = false) final Optional<String> nextContinuationToken) {
        return awss3Service.listFiles(nextContinuationToken.isPresent() ? nextContinuationToken.get() : null);
    }

    @GetMapping(path = "/api/listEvent")
    public ResponseEntity  getListEvents(@RequestParam(value = "page", required = false, defaultValue = "0") final Integer page) {

        Page<DesafioCollection> lists = service.findByUserName(page);
        return new ResponseEntity(lists, HttpStatus.OK);
    }

    @DeleteMapping("/api/delete")
    ResponseEntity<?> deleteFile(@RequestParam("fileName") final String fileName) {
        awss3Service.deleteFile(fileName);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("api/upload")
    @CacheEvict(value = "arquivoUpload", allEntries = true)
    public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("file") final MultipartFile file) {
        String message = "";

        if (file != null && !file.getOriginalFilename().isEmpty()) {
            awss3Service.uploadFile(file.getOriginalFilename(), file);
            message = messageSource.getMessage("uploadMessage", new Object[]{ file.getOriginalFilename()}, Locale.US);
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseMessage(message));
    }

    @GetMapping(value="api/download",
            produces = MediaType.APPLICATION_OCTET_STREAM_VALUE
    )
    @CacheEvict(value="arquivoDownload",allEntries=true)
    public @ResponseBody byte[] downloadFile(@RequestParam("fileName") final String fileName) {
        final byte[] data = awss3Service.downloadFile(fileName);
        return data;
    }

    @GetMapping(path = "/api/iteracoes")
    public ResponseEntity  getIteracoes(@RequestParam("email") final String email) {
        lambdaService.getInteracoes(email);

        return new ResponseEntity(messageSource.getMessage("requestMessageSuccess", null, Locale.US), HttpStatus.OK);
    }
}
