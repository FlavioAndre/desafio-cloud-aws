package com.desafio.data.model;

import com.amazonaws.services.dynamodbv2.datamodeling.*;
import com.desafio.util.LocalDateTimeConverter;

import java.time.LocalDateTime;
import java.util.UUID;

@DynamoDBTable(tableName = "DesafioCollection")
public class DesafioCollection {
    private String id;
    private String fileName;
    private LocalDateTime eventTime;
    private String userName;
    private String event;

    public DesafioCollection() {

    }

    public DesafioCollection(String fileName, LocalDateTime eventTime, String userName, String event) {
        this.fileName = fileName;
        this.eventTime = eventTime;
        this.userName = userName;
        this.event = event;
        this.id = UUID.randomUUID().toString();
    }

    @DynamoDBHashKey
    public String getId() {
        return id;
    }

    @DynamoDBAttribute
    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    @DynamoDBAttribute
    @DynamoDBTypeConverted(converter = LocalDateTimeConverter.class)
    public LocalDateTime getEventTime() {
        return eventTime;
    }

    public void setEventTime(LocalDateTime eventTime) {
        this.eventTime = eventTime;
    }

    @DynamoDBAttribute
    @DynamoDBIndexHashKey(globalSecondaryIndexName = "UserNameIndex")
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setId(String id) {
        this.id = id;
    }

    @DynamoDBAttribute
    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }
}
