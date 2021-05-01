package com.desafio.util;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;

public class LocalDateTimeConverter implements DynamoDBTypeConverter<String, LocalDateTime> {
    @Override
    public String convert(final LocalDateTime time) {
        return time.toString();
    }

    @Override
    public LocalDateTime unconvert(final String dateTimeInString) {
        ZonedDateTime zdt = ZonedDateTime.parse(dateTimeInString);
        return zdt.toLocalDateTime();
    }
}
