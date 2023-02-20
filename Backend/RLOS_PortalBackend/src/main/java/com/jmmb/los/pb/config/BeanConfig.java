package com.jmmb.los.pb.config;

import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.ProxyAuthenticationStrategy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class BeanConfig {
    @Value("${spring.proxy}")
    private boolean isProxy;

    @Value("${spring.proxyURL}")
    private String proxyURL;

    @Bean(name = "restTemplate")
    public RestTemplate getRestTemplate() {
        log.info("Initializing restTemplate bean inside BeanConfig...");
        if (isProxy) {
            return new RestTemplate(getProxyfactory());
        } else {
            return new RestTemplate();
        }
    }

    private HttpComponentsClientHttpRequestFactory getProxyfactory() {
        CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(new AuthScope(proxyURL, 8080),
                new UsernamePasswordCredentials("aditya-kumar", "Amit250397"));
        HttpClientBuilder clientBuilder = HttpClientBuilder.create();
        clientBuilder.setProxy(new HttpHost(proxyURL, 8080, "http"));
        clientBuilder.setDefaultCredentialsProvider(credentialsProvider);
        clientBuilder.setProxyAuthenticationStrategy(new ProxyAuthenticationStrategy());
        CloseableHttpClient client = clientBuilder.build();
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setHttpClient(client);

        return factory;
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**");
            }
        };
    }
}
