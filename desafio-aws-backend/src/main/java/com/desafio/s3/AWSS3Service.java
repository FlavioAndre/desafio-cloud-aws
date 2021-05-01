package com.desafio.s3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import com.desafio.cognito.AuthenticationFacade;
import com.desafio.data.services.DesafioCollectionService;
import com.desafio.s3.model.FileS3Dto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.MessageSource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@ConfigurationProperties(
        prefix = "com.desafio.s3"
)
public class AWSS3Service {
    @Autowired
    private AmazonS3 amazonS3;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private DesafioCollectionService service;

    @Autowired
    private AuthenticationFacade authenticationFacade;

    @Autowired
    private ModelMapper modelMapper;

    private String bucket;

    public void setBucket(String bucket) {
        this.bucket = bucket;
    }

    private String makeFileNameKey(String filename) {
        return  String.format("%s/%s",authenticationFacade.getUserName(), filename);
    }

    @Async
    public String uploadFile(final String fileName,final MultipartFile file) {
        try {
            final String folderFileName = makeFileNameKey(fileName);
            PutObjectResult result = amazonS3.putObject(new PutObjectRequest(this.bucket,
                        folderFileName, file.getInputStream(),null));
          return "http://s3.amazonaws.com/"+this.bucket+"/"+folderFileName;

        } catch (IllegalStateException | IOException ex) {
            amazonS3.deleteObject(this.bucket, fileName);
            throw new RuntimeException(ex);
        }
    }

    @Async
    public byte[] downloadFile(final String fileNameKey) {
        byte[] content = null;
        final S3Object s3Object = amazonS3.getObject(this.bucket, fileNameKey);
        final S3ObjectInputStream stream = s3Object.getObjectContent();

        try {
            content = IOUtils.toByteArray(stream);
            s3Object.close();
        } catch(final IOException ex) {
            throw new RuntimeException(ex);
        }
        return content;
    }

    @Async
    public void deleteFile(final String fileNameKey) {
        try {
            amazonS3.deleteObject(this.bucket, fileNameKey);
        } catch(final AmazonS3Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public Map<String, Object> listFiles(String nextContinuationToken) {
        ListObjectsV2Request request = new ListObjectsV2Request()
                .withBucketName(this.bucket)
                .withMaxKeys(10)
                .withPrefix(authenticationFacade.getUserName()+"/");

        if (nextContinuationToken != null && !nextContinuationToken.isEmpty()) {
            request.setContinuationToken(nextContinuationToken);
        }

        ListObjectsV2Result result = amazonS3.listObjectsV2(request);
        Map<String, Object> map = new HashMap<>();

        map.put("dirs", result.getCommonPrefixes());
        map.put("files", result.getObjectSummaries().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList()));
        map.put("nextContinuationToken", result.getNextContinuationToken());
        map.put("isTruncated", result.isTruncated());

        return map;
    }


    private FileS3Dto convertToDto(S3ObjectSummary s3ObjectSummary) {
        return modelMapper.map(s3ObjectSummary, FileS3Dto.class);
    }
}
