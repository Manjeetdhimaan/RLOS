package com.jmmb.los.pb.security;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenCreationParameters {
	private String arn;
	private String requestIp;
}
