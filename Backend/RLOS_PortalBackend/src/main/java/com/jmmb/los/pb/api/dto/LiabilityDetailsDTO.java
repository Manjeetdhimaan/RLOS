package com.jmmb.los.pb.api.dto;

import lombok.Data;

@Data
public class LiabilityDetailsDTO {

    private Long id;
    private Long applicantId;
    private String type;
    private String comment;
    private String amount;
}
