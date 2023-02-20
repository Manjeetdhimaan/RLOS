package com.los.pb.resume;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import lombok.extern.slf4j.Slf4j;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Slf4j
@SpringBootApplication
@EnableSwagger2
public class ResumeServiceApplication extends SpringBootServletInitializer {
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application){
		return application.sources(ResumeServiceApplication.class);
	}
	
	public static void main(String[] args) {
		try{
			SpringApplication.run(ResumeServiceApplication.class, args);
			log.info("ResumeServiceApplication Started");
		}
		catch(Exception e){
			System.out.println(e);
		}
	}

}
