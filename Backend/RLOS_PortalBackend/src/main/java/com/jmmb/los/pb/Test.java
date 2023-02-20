package com.jmmb.los.pb;

import com.jmmb.los.pb.api.dto.AddressDTO;
import com.jmmb.los.pb.api.dto.ApplicantDTO;
import com.jmmb.los.pb.api.dto.ApplicationDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

public class Test {
    public static void main(String[] args) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        ApplicationDTO dto = new ApplicationDTO();
        ApplicantDTO appDto = new ApplicantDTO();
        appDto.setFirstName("Kushal");
        appDto.setLastName("Gupta");
        appDto.setEmail("kushal.gupta@newgen.co.in");
        List<ApplicantDTO> list = new ArrayList<>();
        list.add(appDto);
        dto.setApplicants(list);
        System.out.println(mapper.writeValueAsString(dto));

    }
}
