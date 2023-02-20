package com.jmmb.los.pb.api.dto;

import lombok.Data;

@Data
public class ExpenseDetailsDTO {
    
    private Long id;
    private Long applicantId;
    private String type;
    private String frequency;
    private String comment;
    private String amount;

}
