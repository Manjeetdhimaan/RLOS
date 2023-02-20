package com.jmmb.los.pb.security;

import java.lang.annotation.Annotation;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.jmmb.los.pb.api.dto.ApplicationDTO;
import com.jmmb.los.pb.api.dto.ClientResponseDTO;

import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class TokenCreatorAdvice<T> implements ResponseBodyAdvice<T> {
	@Autowired
	private ApplicationTokenProvider tokenProvider;

	@Override
	public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
		// advice to modify response only if the controller method has the
		// ApplicationEntryPoint annotation
		List<Annotation> annotations = Arrays.asList(returnType.getMethodAnnotations());
		return annotations.stream()
				.anyMatch(annotation -> annotation.annotationType().equals(ApplicationEntryPoint.class));

	}

	@Override
	public T beforeBodyWrite(T body, MethodParameter returnType, MediaType selectedContentType,
			Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request,
			ServerHttpResponse response) {

		final HttpServletRequest servletRequest = ((ServletServerHttpRequest) request).getServletRequest();
		TokenCreationParameters tokenCreationData = getTokenCreationDataFromResponseBody(body, servletRequest);
		log.debug("generating token");
		if (!Objects.isNull(tokenCreationData) && StringUtils.isNotEmpty(tokenCreationData.getArn())) {
			String token = tokenProvider.generateToken(tokenCreationData);
			// for validation call
			response.getHeaders().set("Access-Control-Expose-Headers", "authentication");
			response.getHeaders().set("authentication", token);
		}
		return body;
	}

	private TokenCreationParameters getTokenCreationDataFromResponseBody(T body, HttpServletRequest servletRequest) {
		TokenCreationParameters tokenParams = null;
		String ip = servletRequest.getRemoteAddr();
		String uri = servletRequest.getRequestURI();
		//if (body instanceof ApplicationDTO && uri.contains("api/applications/createApplication")) {
		if (body instanceof ClientResponseDTO<?> && uri.contains("api/applications/createApplication")) {
			ClientResponseDTO<?> resBody = (ClientResponseDTO<?>) body;
			ApplicationDTO applicationDto = (ApplicationDTO) resBody.getData();
			logARN(applicationDto.getArn());
			tokenParams = new TokenCreationParameters(applicationDto.getArn(), ip);
		} else if (uri.contains("api/applications/refreshToken") || uri.contains("api/applications/getApplication")) {
			String[] splitRequest = servletRequest.getRequestURI().split("/");
			String arn = splitRequest[5];
			logARN(arn);
			tokenParams = new TokenCreationParameters(arn, ip);
		}
		return tokenParams;
	}

	private void logARN(String arn) {
		log.info("ARN-> {}", arn);
	}
}
