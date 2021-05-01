package com.desafio.cognito;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.text.MessageFormat;

@Component
@ConfigurationProperties(
        prefix = "com.desafio.jwt.aws"
)
public class JwtConfiguration {
    private String userPoolId;
    private String identityPoolId;
    private String jwkUrl;
    private String region;
    private String urlWellKnown;
    private String urlCognito;
    private String userNameField = "username";
    private String userEmailField = "email";
    private int connectionTimeout = 2000;
    private int readTimeout = 2000;
    private String httpHeader = "Authorization";

    public JwtConfiguration() {
    }

    public String getJwkUrl() {
        return this.jwkUrl != null && !this.jwkUrl.isEmpty() ?
                this.jwkUrl :
                MessageFormat.format(this.urlWellKnown, this.region, this.userPoolId);
    }

    public void setJwkUrl(String jwkUrl) {
        this.jwkUrl = jwkUrl;
    }

    public String getCognitoIdentityPoolUrl() {
        return MessageFormat.format(this.urlCognito, this.region, this.userPoolId);
    }

    public String getUserPoolId() {
        return userPoolId;
    }

    public void setUserPoolId(String userPoolId) {
        this.userPoolId = userPoolId;
    }

    public String getIdentityPoolId() {
        return identityPoolId;
    }

    public void setIdentityPoolId(String identityPoolId) {
        this.identityPoolId = identityPoolId;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getUserNameField() {
        return userNameField;
    }

    public void setUserNameField(String userNameField) {
        this.userNameField = userNameField;
    }

    public String getUserEmailField() {
        return userEmailField;
    }

    public void setUserEmailField(String userEmailField) {
        this.userEmailField = userEmailField;
    }

    public int getConnectionTimeout() {
        return connectionTimeout;
    }

    public void setConnectionTimeout(int connectionTimeout) {
        this.connectionTimeout = connectionTimeout;
    }

    public int getReadTimeout() {
        return readTimeout;
    }

    public void setReadTimeout(int readTimeout) {
        this.readTimeout = readTimeout;
    }

    public String getHttpHeader() {
        return httpHeader;
    }

    public void setHttpHeader(String httpHeader) {
        this.httpHeader = httpHeader;
    }

    public String getUrlWellKnown() {
        return urlWellKnown;
    }

    public void setUrlWellKnown(String urlWellKnown) {
        this.urlWellKnown = urlWellKnown;
    }

    public String getUrlCognito() {
        return urlCognito;
    }

    public void setUrlCognito(String urlCognito) {
        this.urlCognito = urlCognito;
    }
}
