package com.los.pb.resume.services;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

import javax.crypto.KeyGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OtpGenerator {

    @Autowired
    private TimeBasedOneTimePasswordGenerator timeBasedOneTimePasswordGenerator;

    public String generateOTP(String otpFormat) throws NoSuchAlgorithmException, InvalidKeyException{
        Date dateTimeNow = new Date();
        final Key otpGenerated;
        final KeyGenerator keyGenerator = KeyGenerator.getInstance(timeBasedOneTimePasswordGenerator.getAlgorithm());
        keyGenerator.init(512);
        otpGenerated = keyGenerator.generateKey();
        return String.format(otpFormat, timeBasedOneTimePasswordGenerator.generateOneTimePassword(otpGenerated, dateTimeNow));
        //return "123456";
    }

}
