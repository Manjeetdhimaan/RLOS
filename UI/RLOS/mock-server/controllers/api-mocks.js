/* eslint-disable class-methods-use-this */
var mdm = require('../assets/mocks/mdm');
var sessionConfig = require('../assets/mocks/session-config');
var loanData = require('../assets/mocks/loan-data');
var primaryApplicantDocuments = require('../assets/mocks/primary-applicant-documents');
var experianQuestions = require('../assets/mocks/experian-question');
var experianResponse = require('../assets/mocks/experian-response');
var coApplicantDocuments = require('../assets/mocks/co-applicant-documents');
var dConfig = require('../assets/mocks/document-config');
var frontIdDocumentImage = require('../assets/mocks/document-image-front');
var backIdDocumentImage = require('../assets/mocks/document-image-back');
var mock_application = require('../assets/mocks/application');
var rlos = require('../assets/mocks/RLOS');
var application_dashboard = require('../assets/mocks/application-dashboard');
module.exports.createApplication = function(request, response) {

    let application = Object.assign({}, request.body);
    if (application && application.applicants) {
        application.applicants[0].id = 123;
    }

    let payload = Object.assign({}, {
        arn: "20201002-1234"
    }, application);

    response.set({
        'Bearer': 'ABCD'
    });
    response.set('Access-Control-Expose-Headers', 'Bearer');
    return response.status(201).send(payload);
}

module.exports.updateApplication = function(request, response) {
    return response.status(200).send(request.body);
}

module.exports.validateApplication = function(request, response) {

    response.set({
        'Bearer': 'ABCD'
    });
    response.set('Access-Control-Expose-Headers', 'Bearer')

    return response.status(200).send(request.body);
};

module.exports.getApplication = function(request, response) {
    return response.status(200).send(mock_application);
};

module.exports.getApplications= function(request, response) {
    return response.status(200).send(application_dashboard );
};

module.exports.createApplicant = function(request, response) {
    var payload = Object.assign({}, request.body, {
        id: "1"
    });
    return response.status(201).send(payload);
};

module.exports.updateApplicant = function(request, response) {
    console.log(JSON.stringify(request.body));
    return response.status(200).send(request.body);
};

module.exports.createOrUpdateCollateral = function(request, response) {
    console.log(JSON.stringify(request.body));
    return response.status(200).send(request.body);
};

module.exports.deleteApplicant = function(request, response) {
    return response.status(200).send();
};

module.exports.saveDocument = function(request, response) {
    request.body.forEach((temp) => {
        temp.images.forEach((image, index) => {
            image.data = null;
            image.omnidocsKey = index
        });
    })
    return response.status(200).send(request.body);
};

module.exports.getMDMData = function(request, response) {
    //req.params.locale
    //req.params.module
    return response.status(200).send(mdm);
};

module.exports.getSessionConfig = function(request, response) {
    //req.params.locale
    //req.params.module
    return response.status(200).send(sessionConfig);
};

module.exports.getConfig = function(request, response) {
    console.log("logged");
    console.log(dConfig);
    return response.status(200).send(dConfig);
};

module.exports.getDocuments = function(request, response) {
    if (request.params.applicantId === "1") {
        return response.status(200).send(primaryApplicantDocuments);
    } else {
        return response.status(200).send(coApplicantDocuments);
    }
};

module.exports.getImage = function(request, response) {
    if (request.params.omnidocskey === "TAX") {
        return response.status(200).send(frontIdDocumentImage);
    } else {
        return response.status(200).send(backIdDocumentImage);
    }
};

module.exports.deleteImage = function(request, response) {
    return response.status(200).send();
};

module.exports.putPreferences = function(request, response) {
    return response.status(200).send(request.body);
};

module.exports.createIBPSApplication = function(request, response) {
    return response.status(201).send("1234567890");
};

module.exports.saveConsents = function(request, response) {
    return response.status(201).send(request.body);
};

module.exports.submitDocuments = function(request, response) {
    return response.status(201).send(request.body);
};

module.exports.getExperianQuestions = function(request, response) {
    return response.status(200).send(experianQuestions);
};

module.exports.saveExperianAnswer = function(request, response) {
    return response.status(200).send(experianResponse);
};

module.exports.getLoanData = function(request, response) {
    return response.status(200).send(loanData);
};

module.exports.submitCustomerAcceptance = function(request, response) {
    return response.status(200).send(request.body);
};
module.exports.refreshToken = function(request, response) {
    return response.status(200).send(request.body);
};

module.exports.getRLOSData = function(request, response) {
    return response.status(200).send(rlos);
};

module.exports.uploadDocuments = function(request, response) {
    request.body = Object.assign(request.body, { "odIndex": '1234' });
    return response.status(200).send(request.body);
};