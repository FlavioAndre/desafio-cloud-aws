package com.desafio.cognito;

import com.google.common.collect.Lists;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;


@Component
public class AwsCognitoIdTokenProcessor {
    private static String ROLE_ADMIN="ROLE_ADMIN";
    private static String BEARER="Bearer ";

    @Autowired
    private JwtConfiguration jwtConfiguration;

    @Autowired
    private ConfigurableJWTProcessor configurableJWTProcessor;

    @Autowired
    private MessageSource messageSource;

    public Authentication authenticate(HttpServletRequest request) throws Exception {
        String idToken = request.getHeader(this.jwtConfiguration.getHttpHeader());
        if (idToken != null) {
            JWTClaimsSet claims = this.configurableJWTProcessor.process(this.getBearerToken(idToken), null);
            validateIssuer(claims);
            verifyIfIdToken(claims);
            String username = getUserNameFrom(claims);
            if (username != null) {
                List<GrantedAuthority> grantedAuthorities = Lists.newArrayList(new SimpleGrantedAuthority(ROLE_ADMIN));
                User user = new User(username, "", Lists.newArrayList());
                return new JwtAuthentication(user, claims, grantedAuthorities);
            }
        }
        return null;
    }

    private String getUserNameFrom(JWTClaimsSet claims) {
        return claims.getClaims().get(this.jwtConfiguration.getUserNameField()).toString();
    }

    private String getUserEmailFrom(JWTClaimsSet claims) {
        return claims.getClaims().get(this.jwtConfiguration.getUserEmailField()).toString();
    }

    private void verifyIfIdToken(JWTClaimsSet claims) throws Exception {
        if (!claims.getIssuer().equals(this.jwtConfiguration.getCognitoIdentityPoolUrl())) {
            throw new Exception(messageSource.getMessage("jwtTokenInvalido", null, Locale.US));
        }
    }

    private void validateIssuer(JWTClaimsSet claims) throws Exception {
        if (!claims.getIssuer().equals(this.jwtConfiguration.getCognitoIdentityPoolUrl())) {
            throw new Exception(messageSource.getMessage("issuerNaoEncontrado", new Object[] {claims.getIssuer(),this.jwtConfiguration.getCognitoIdentityPoolUrl()}, Locale.US));
        }
    }

    private String getBearerToken(String token) {
        return token.startsWith(BEARER) ? token.substring(BEARER.length()) : token;
    }
}
