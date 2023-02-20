package com.jmmb.los.pb.ibps.dto;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name="Q_PEPStatus_GRID")
@XmlAccessorType(XmlAccessType.FIELD)
public class PEPDetailsGrid {
	// DB Table: NG_RLOS_PEPStatus_GRID
	// PEPPrefix
	// OD_Index
	
	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;
	
	@XmlElement(name="InsertionOrderId")
	private String elementId;
	
	@XmlElement(name="MemberID")
	private String memberId;
	
	@XmlElement(name="ApplicantName")
	private String memberName;
	
	@XmlElement(name="ApplicantTypePortalOnly")
	private String memberType;

	@XmlElement(name="ApplicantLoanRelation")
	private String loanRelationship;
	
	@XmlElement(name="CurrentPEPStatus")
	private String currentlyPep;
	
	@XmlElement(name="PreviouslyPEP")
	private String previouslyPep;
	
	@XmlElement(name="RelationtoPEP")
	private String relationToPep;
	
	@XmlElement(name="FirstName")
	private String pepFirstName;
	
	@XmlElement(name="MiddleName")
	private String pepMiddleName;
	
	@XmlElement(name="LastName")
	private String pepLastName;
	
	@XmlElement(name="PEPSuffix")
	private String pepSuffix;
	
	@XmlElement(name="PEPCountry")
	private String pepCountry;
	
	@XmlElement(name="PositionTitle")
	private String positionTitle;
	
	@XmlElement(name="DetailsofPositionHeld")
	private String detailsOfPositonHeld;
	
	@XmlElement(name="PEPDateAdded")
	private String dateAddedToPepList;
	
	@XmlElement(name="YearsinPosition")
	private String yearsInPosition;
	
	@XmlElement(name="PEPDateRemoved")
	private String dateRemovedFromPep;
	
	@XmlElement(name="NG_RLOS_RelationshipDetailsTable")
	private List<PEPRelationGrid> relationGrid;
}
