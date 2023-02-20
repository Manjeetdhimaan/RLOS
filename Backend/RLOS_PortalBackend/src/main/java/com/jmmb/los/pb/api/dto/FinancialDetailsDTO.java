package com.jmmb.los.pb.api.dto;

import java.util.List;

import javax.validation.Valid;

import org.springframework.validation.annotation.Validated;

import lombok.Data;

@Data
@Validated
public class FinancialDetailsDTO {
	private Long id;
	
	@Valid
	private List<IncomeDetailsDTO> incomeDetails;
	
	@Valid
	private List<AssetDTO> assetDetails;
	// private List<LiabilityDetailsDTO> liabilityDetails;
	// private List<ExpenseDetailsDTO> expenseDetails;
}
