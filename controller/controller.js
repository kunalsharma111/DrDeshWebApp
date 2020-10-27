const express = require('express');
var mongo = require('mongodb');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
var nodemailer = require("nodemailer");
var multer  = require('multer')
const router = express();

// const router = express.Router();
const logger = require("../logger/logger");
require('../models/db');
const userModel = mongoose.model("User");
const employeeFacility = mongoose.model("EmployeeFacility");
const requiredDocumentModel = mongoose.model("DocumentRequiredFromEmployee");
const patientModel = mongoose.model("Patient");
const R2Model = mongoose.model("R2P");
const FacilityModel = mongoose.model("Facility");
const InsuranceModel = mongoose.model("Insurance");
const MedicationModel = mongoose.model("Medication");
const ProviderModel = mongoose.model("Provider");
const MasterPatientModel = mongoose.model("MasterPatient");
const MasterPatientModell = mongoose.model("MasterPatientt");
const PostModel = mongoose.model("PostRoundUp");
var path = require("path");
const VModel = mongoose.model('MVM');
var bcrypt = require('bcryptjs');
const fs = require('fs');
// middleware to use for all requests
router.use(function(req, res, next) {
    console.log('Url is: ' + req.url);
    console.log(req.method+" Method");
    next(); // make sure we go to the next routes and don't stop here
  });

//register start
router.post("/users", (req, res) => {
    // console.log(req.body);
    var user = new userModel(req.body);
    // console.log(user);
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.pwd, salt, function (err, hash) {
            // Store hash in your password DB.
            console.log(hash);
            user.pwd = hash;
            if (!err) {
                user.save((err, doc) => {
                    if (err) {
                        console.log("Error" + err);
                        logger.error("Error" + err);
                        res.send("failed");
                    } else {
                        console.log(doc);
                        let payload = { subject: doc._id };
                        let token = jwt.sign(payload, 'keysecret');
                        res.status(200).json(token);
                        logger.info("user saved successfully" + doc.email);
                    }
                });
            } else {
                logger.info("error in hashing the password");
                console.log("error in hashing the password");
            }
        });
    });
});
// register ends
let sub;
function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(" ")[1];
    if (token === 'null') {
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'keysecret');
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }
    req.userId = payload.subject;
    sub = payload.subject;
    next();
}
//get current user starts
var currentuser;
router.get('/red', verifyToken, (req, res) => {
    userModel.findOne({ _id: sub },{'fname':1,'userrole':1}, function (err, user) {
        if (!err) {
            currentuser = user.fname;
            logger.info("Name of current user is" + currentuser);
            res.json(user);
        }
        if (err) {
            logger.error("Error in getting current user " + err);
            console.log(err);
        }
    });
})
// get current user ends


router.get('/patientdetail',verifyToken, (req,res) => {
    MasterPatientModel.findById(req.query.id).then(doc => {
        // console.log(doc.visits.length)
        // console.log(doc.visits[doc.visits.length-1])
        // console.log(doc.visits)
        console.log(doc.dob)
        console.log(doc.name)
        if (doc.visits.length > 0) {
            console.log("visits not null", doc.visits[doc.visits.length - 1])
            res.json({ visit: doc.visits[doc.visits.length ], name: doc.name, dob: doc.dob });
        }
        else {
            console.log("visits null", doc)
            res.json(doc)
        }
    }, err => {
        res.json(err);
    })
})

router.get('/man', verifyToken, (req, res) => {
    res.end("god");
})
router.post('/pat', verifyToken, (req, res) => {
    console.log(req.body);
    var patient = new patientModel({
        name: req.body.name,
        dob: req.body.dob,
        theligible: req.body.theligible,
        medication: req.body.medication,
        generictest: req.body.generictest,
        docterupload: req.body.docterupload,
        demographicsheetuploaded: req.body.demographicsheetuploaded,
        capacityassesment: req.body.capacityassesment,
        scaleeligible: req.body.scaleeligible,
        bhi: req.body.bhi,
        ccm: req.body.ccm,
        patientcondition: req.body.patientcondition
    })
    console.log(patient);
    patient.save().then(doc => { console.log("saved"); res.json('saved') }, err => {
        console.error("error");
        res.json('failure');
    })
})
router.post('/sendmoredata', verifyToken, (req, res) => {
    console.log(req.body);
    patientModel.findByIdAndUpdate(req.body.id, req.body, (err, doc) => {
        if (!err) {
            console.log(doc);
            res.json('saved to db');
        }
    })
})
router.post('/r2', verifyToken, (req, res) => {
    console.log(req.body);
    let visit = {
        eval: req.body.eval,
        seedoc: req.body.seedoc,
        droped: req.body.droped,
        stable: req.body.stable,
        gdrstable: req.body.gdrstable,
        psythreapy: req.body.psythreapy,
        labs: req.body.labs,
        labname: req.body.labname,
        medmange: req.body.medmange,
        urgentcall: req.body.urgentcall,
        outreach: req.body.outreach,
        room: req.body.room,
        visit: req.body.visit,
        unstable_text: req.body.unstable_text,
        started: req.body.started,
        increase: req.body.increase,
        decrease: req.body.decrease,
        stopped: req.body.stopped,
        medstopdate: req.body.medstopdate,
        psa: req.body.psa,
        providername: req.body.providername,
        followup: req.body.followup,
        added: req.body.added,
        addeddate: req.body.addeddate,
        yesstable: req.body.yesstable,
        nostable: req.body.nostable
    }
    let data = new R2Model({
        _id: req.body.id,
        visitations: [visit]
    });
    if (req.body.newappointmentrecord == 'yes') {
        R2Model.findById(data._id, ((err, record) => {
            if (record) {
                record.visitations.push(visit);
                record.save().then(result => {
                    res.json('record save to db' + result)
                }, err => {
                    console.log('theres was n error during save' + err);
                })
            }
            else {
                data.save().then(res => {
                    res.json('this was a brand new record');
                }, err => {
                    res.json("could not update this record contact support id the issue persists")
                })
            }
        }))
    }
    else {
        R2Model.findById(data._id, (err, rec) => {
            if (!err) {
                console.log("no error" + rec);
                if (rec) {
                    R2Model.findById(data._id, (err, doc) => {
                        let index;
                        if (!err) {
                            doc.visitations.forEach((rec, i) => {
                                console.log("visit on db" + rec.visit);
                                console.log(visit.visit)
                                if (rec.visit == visit.visit) {
                                    index = i;
                                }
                            })
                            doc.visitations[index] = visit;
                            doc.save().then(r => {
                                console.log("update force");
                                res.json('record updated')
                            }, err => {
                                console.log("some eeeeeee" + err);
                                res.json('error in updaetd')
                            })
                        }
                    })
                } else {
                    data.save().then(result => {
                        res.json("added new record");
                    }, err => {
                        res.json('error in updating record');
                    })
                }
            }
        })

    }
})
router.get('/patien', verifyToken, (req, res) => {
    MasterPatientModel.find({}, (err, doc) => {
        if (!err) {
            res.json(doc);
        }
        else {
            console.log(err);
        }
    })
})
router.get('/r2p', verifyToken, (req, res) => {
    R2Model.find({}, (err, doc) => {
        if (!err) {
            res.json(doc);
        }
        else {
            res.status(401).send('Invalid Response');
        }
    })
})

// facility add starts
router.post('/facilityadd', verifyToken, (req, res) => {
    if (req.body.id == null) {
        let facility = new FacilityModel(req.body);
        facility.save(err => {
            if (!err) {
                logger.info("facility saved " + facility.name);
                res.json('saved to db');
            }
            else {
                logger.error("error in saving facility" + err);
                console.log(err);
            }
        })
    } else {
        FacilityModel.findByIdAndUpdate(req.body.id, req.body, (err, doc) => {
            if (!err) {
                logger.info("facility data updated" + req.body.name);
                res.json('record updated')
            }
            else {
                logger.error("Error in updating facility data"+ err);
                res.json('some error');
            }
        })
    }
})
// facility add end

// get facility start
router.get('/getfacility', verifyToken, (req, res) => {
    FacilityModel.find({}, (err, doc) => {
        if (!err) {
            logger.info("Got Facility data");
            res.json(doc);
        }
        else {
            logger.error("Error in fetching facility data" + err );
            console.log('err to fetch details');
        }
    }).sort({"name":1})
})
// get facility ends

// get activated facility start
router.get('/getactivefacility', verifyToken, (req, res) => {
    FacilityModel.find({"ain":"Active"}, (err, doc) => {
        if (!err) {
            logger.info("Got activated facility");
            res.json(doc);
        }
        else {
            logger.error("Error in getting activated facility"+err);
            console.log('err to fetch details');
        }
    }).sort({"name":1})
})
// get activate facility ends

// add insurance starts
router.post('/insuranceadd', verifyToken, (req, res) => {
    console.log(req.body);
    if (req.body.id == null) {
        let insurance = new InsuranceModel(req.body);
        insurance.save(err => {
            if (!err) {
                logger.info("New Insurance got added");
                res.json('saved to db');
            }
            else {
                logger.error("Error in saving new insurance"+err);
                console.log(err);
            }
        })
    } else {
        InsuranceModel.findByIdAndUpdate(req.body.id, req.body, (err, doc) => {
            if (!err) {
                logger.info("Record updated for insurance");
                res.json('record updated')
            }
            else {
                logger.error("Error in updating Insurance data");
                res.json('some error');
            }
        })
    }
})
// add insurance ends

// get insurance starts
router.get('/getinsurance', verifyToken, (req, res) => {
    InsuranceModel.find({}, (err, doc) => {
        if (!err) {
            logger.info("Got all the insurances");
            res.json(doc);
        }
        else {
            logger.error("Error in getting all the insurance"+err);
            console.log('err to fetch details');
        }
    }).sort({"name":1})
})
// get insurance ends

// add provider starts
router.post('/provideradd', verifyToken, (req, res) => {
    if (req.body.id == null) {
        let provider = new ProviderModel(req.body);
        provider.save(err => {
            if (!err) {
                logger.info("Added new provider"+req.body.name);
                res.json('saved to db');
            }
            else {
                logger.error("Error in saving new provider"+err);
                console.log(err);
            }
        })
    } else {
        ProviderModel.findByIdAndUpdate(req.body.id, req.body, (err, doc) => {
            if (!err) {
                logger.info("updated provider record"+req.body.name);
                res.json('record updated')
            }
            else {
                logger.error("error in updating provider data"+err);
                res.json('some error');
            }
        })
    }
})
// addd provider ends

// get provider starts
router.get('/getprovider', verifyToken, (req, res) => {
    ProviderModel.find({}, (err, doc) => {
        if (!err) {
            logger.info("getting all the provider data");
            res.json(doc);
        }
        else {
            logger.error("error in getting all the provider data"+err);
            console.log('err to fetch details');
        }
    }).sort({"name":1})
})
// get provider ends

// get active provider starts
router.get('/getactiveprovider', verifyToken, (req, res) => {
    ProviderModel.find({"ain":"Active"}, (err, doc) => {
        if (!err) {
            logger.info("got all the Active provider info");
            res.json(doc);
        }
        else {
            logger.error("Error in getting all the active provider"+err);
            console.log('err to fetch details');
        }
    }).sort({"name":1})
})
// get active provider ends

// add meds start
router.post('/medadd', verifyToken, (req, res) => {
    if (req.body.id == null) {
        let med = new MedicationModel(req.body);
        med.save(err => {
            if (!err) {
                logger.info("New medicine got saved "+req.body.name);
                res.json('saved to db');
            }
            else {
                logger.error("Error in saving new medicine"+err);
                console.log(err);
            }
        })
    } else {
        MedicationModel.findByIdAndUpdate(req.body.id, req.body, (err, doc) => {
            if (!err) {
                logger.info("Update Medicine data "+req.body.name);
                res.json('record updated')
            }
            else {
                logger.error("Error in updating medicine data");
                res.json('some error');
            }
        })
    }
})
// add meds ends

// get meds start
router.get('/getmed', verifyToken, (req, res) => {
    MedicationModel.find({}, (err, doc) => {
        if (!err) {
            logger.info("Got all the meds");
            res.json(doc);
        }
        else {
            logger.info("Error in getting all the meds");
            console.log('err to fetch details');
        }
    }).sort({"name":1})
})
// get meds ends

// saving visit data for patient starts
router.post('/goku', verifyToken, (req, res,next) => {
    var days = new Date();
    // days.setDate(days.getDate() + 7);
    // if (req.body.medfollowup != "Per routine protocol") {
    //     days = req.body.followupdays;
    // }
    // console.log(req.body);
    // console.log("1"+ req.body.visit);
    if (!req.body.visit) {
        req.body.visit = new Date()
    }
    req.body.savedon = new Date();
    if(!req.body.savedby){
        req.body.savedby = currentuser;
    }
    let masterdata = {
        savedon : req.body.savedon,
        savedby : req.body.savedby,
        visit: new Date(req.body.visit),
        careconditiontimespent: req.body.careconditiontimespent,
        seedoc: req.body.seedoc,
        noseedocreason: req.body.noseedocreason,
        othernoseedocreason: req.body.othernoseedocreason,
        psynoseedocreason: req.body.psynoseedocreason,
        otherpsynoseedocreason: req.body.otherpsynoseedocreason,
        stable: req.body.stable,
        gdrstable: req.body.gdrstable,
        psythreapy: req.body.psythreapy,
        reasonpsy: req.body.reasonpsy,
        psyscreen: req.body.psyscreen,
        psyscreenreason: req.body.psyscreenreason,
        labs: req.body.labs,
        labname: req.body.labname,
        medmanage: req.body.medmanage,
        reasonmedmanage: req.body.reasonmedmanage,
        followup: req.body.followup,
        patientcondition: req.body.patientcondition,
        unstable_text: req.body.unstable_text,
        started: req.body.started,
        increase: req.body.increase,
        decrease: req.body.decrease,
        stopped: req.body.stopped,
        decrease2: req.body.decrease2,
        stopped2: req.body.stopped2,
        medstopdate: req.body.medstopdate,
        newappointmentrecord: req.body.newappointmentrecord,
        added: req.body.added,
        addeddate: req.body.addeddate,
        yesstable: req.body.yesstable,
        nostable: req.body.nostable,
        verystable: req.body.verystable,
        yesstablepsy: req.body.yesstablepsy,
        nostablepsy: req.body.nostablepsy,
        verystablepsy: req.body.verystablepsy,
        psymanage: req.body.psymanage,
        seepsy: req.body.seepsy,
        noseepsyreason: req.body.noseepsyreason,
        theligible: req.body.theligible,
        pinsurance: req.body.pinsurance,
        sinsurance: req.body.sinsurance,
        facility: req.body.facility,
        provider: req.body.provider,
        room: req.body.room,
        medication: req.body.medication,
        medicationName: req.body.medicationName,
        generictest: req.body.generictest,
        pcp: req.body.pcp,
        genericresult: req.body.genericresult,
        docterupload: req.body.docterupload,
        demographicsheetuploaded: req.body.demographicsheetuploaded,
        capacityassesment: req.body.capacityassesment,
        capacity: req.body.capacity,
        bhi: req.body.bhi,
        ccm: req.body.ccm,
        bhiconcent: req.body.bhiconcent,
        ccmconcent: req.body.ccmconcent,
        medmanage2: req.body.medmanage2,
        scaleeligible: req.body.scaleeligible,
        scale: req.body.scale,
        comment: req.body.comment,
        service_type: req.body.service_type,
        frequentlypsychotherapy: req.body.frequentlypsychotherapy,
        typevisit: req.body.typevisit,
        medreason: req.body.medreason,
        othermedreason: req.body.othermedreason,
        geneticreason: req.body.geneticreason,
        othergeneticreason: req.body.othergeneticreason,
        medreason2: req.body.medreason2,
        othermedreason2: req.body.othermedreason2,
        psyreason: req.body.psyreason,
        otherpsyreason: req.body.otherpsyreason,
        otherpsyscreenreason: req.body.otherpsyscreenreason,
        bhireason: req.body.bhireason,
        otherbhireason: req.body.otherbhireason,
        ccmreason: req.body.ccmreason,
        otherccmreason: req.body.otherccmreason,
        homeclinic: req.body.homeclinic,
        homeclinicconcent: req.body.homeclinicconcent,
        homeclinicreason: req.body.homeclinicreason,
        otherhomeclinicreason: req.body.otherhomeclinicreason,
        masterstable: req.body.masterstable,
        masterstablereason: req.body.masterstablereason,
        typevisitreason: req.body.typevisitreason,
        thtime: req.body.thtime,
        consult: req.body.consult,
        conpsy: req.body.conpsy,
        conmed: req.body.conmed,
        conscr: req.body.conscr,
        conpsyreason: req.body.conpsyreason,
        conmedreason: req.body.conmedreason,
        conscrreason: req.body.conscrreason,
        conpsyname: req.body.conpsyname,
        currentmeds: req.body.currentmeds,
        psy_symptoms: req.body.psy_symptoms,
        meds_symptoms: req.body.meds_symptoms,
        exmeds: req.body.exmeds,
        scaleinfo: req.body.scaleinfo,
        np: req.body.np,
        cch: req.body.cch,
        cchconcent: req.body.cchconcent,
        cchdate: req.body.cchdate,
        cchreason: req.body.cchreason,
        othercchreason: req.body.othercchreason,
        medfollowup: req.body.medfollowup,
        followupreason: req.body.followupreason,
        followupdays: req.body.followupdays,
        scaleeligiblereason: req.body.scaleeligiblereason,
        otherscaleeligiblereason: req.body.otherscaleeligiblereason,
        scaledays: req.body.scaledays,
        summary: req.body.summary,
        nextvisitdate: req.body.nextvisitdate
    }
    MasterPatientModel.findById(req.body.id, (err, doc) => {
        if (!err) {
            if(doc.visits.length > 0){
            lastdate = new Date(doc.visits[doc.visits.length-1].savedon);
            latestdate = new Date(masterdata.savedon);
                // checking for that it is not autogenerated visit
            if(lastdate.getHours() == latestdate.getHours() &&
                lastdate.getMonth() == latestdate.getMonth() &&
                lastdate.getDate() == latestdate.getDate()){
                    console.log("same");
            }
            else{
                // checking for condition that it is not auto genrated and last visit is not got save in last 5 minutes
                if(lastdate.getMinutes() > 57 && (lastdate.getHours()+1) == latestdate.getHours()){
                    console.log("dont add" + lastdate.getHours());
                }
                // if all condition got satisfy save
                else{
                    doc.visits.push(masterdata);
                    doc.save().then(res => {
                    console.log("add");
                    logger.info("Visit data saved for patient "+ req.body.name);
                    }, err => {
                    logger.error("Error in saving visit data for patient");
                    console.log(err);
                    })
                }
                }
            }
            // if it is first visit
            else{
                console.log("first visit");
                doc.visits.push(masterdata);
                doc.save().then(res => {
                console.log(res);
                logger.info("First visit for this specific patient saved "+ req.body.name);
                }, err => {
                logger.error("Error in saving first visit data for patient " + req.body.name + " error " + err);
                console.log(err);
                })
            }
            next();
        }
    })

});
// saving visit data for patient ends

// Change password is divided into three apis /changepassword -> /otp -> /confirmotp

// confirmotp starts
router.post("/confirmotp", (req, res) => {
    var user = req.body;
    userModel.findOne({ email: user.em }, (err, doc) => {
        if (err) {
            logger.info("Error in confirm otp of email " + user.em);
            console.log(err);
        }
        else {
            if (!doc) {
                logger.info("Email not preset email " + user.em);
                res.status(401).send('Email not present');
            }
            else {
                if (doc.otp == user.oo) {
                    logger.info("Right OTP Change Password email" + user.em);
                    res.json("right OTP Change Passoword");
                }
                else {
                    logger.info("Wrong OTP")
                    res.status(401).send('Wrong OTP');
                }
            }
        }
    });
})
// confirmotp ends

// changepassword starts
router.post("/changepassword", (req, res) => {
    var userr = req.body;
    userModel.findOne({ email: userr.em }, (err, doc) => {
        if (err) {
            logger.error("error in changing password email " + user.em);
            console.log(err);
        }
        else {
            if (!doc) {
                logger.info("Email not present email" + user.em);
                res.status(401).send('Email not present');
            }
            else {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(userr.pw1, salt, function (err, hash) {
                        // Store hash in your password DB.
                        console.log(hash);
                        userr.pw1 = hash;
                        if (!err) {
                            const user = userModel.updateOne({ _id: doc._id }, { $set: { pwd: userr.pw1 } }, (err, doc) => {
                                if (!err) {
                                    logger.info("password changed successfully email "+ user.em);
                                    res.json("password change successfully");
                                    // let payload = { subject: doc._id };
                                    // let token = jwt.sign(payload, 'keysecret');
                                    // res.status(200).json(token);
                                }
                                else {
                                    logger.error("password change failed email " + user.em);
                                    res.json("password change failed");
                                }
                            });
                        } else {
                            logger.error("Error in changing the password email " + user.em);
                            console.log("error in hashing the password");
                        }
                    });
                });
            }
        }
    });
})
// changepassword ends

// otp starts
router.post("/otp", (req, res) => {
    var user = req.body;
    var ott = Math.floor(100000 + Math.random() * 900000);
    var ee = user.email;
    userModel.findOne({ email: user.email }, (err, doc) => {
        if (err) {
            logger.error("Error in Sending OTP " + user.email);
            console.log(err);
        }
        else {
            if (!doc) {
                logger.error("Email not registered email " + user.email);
                res.status(401).send('Email not registered')
            }
            else {
                const user = userModel.updateOne({ _id: doc._id }, { $set: { otp: ott } }, (err, doc) => {
                    if (!err) {
                        res.json({ e: ee });
                    }
                });
                let mailTransporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'balwellbeingllc@gmail.com',
                        pass: 'Balanced123'
                    }
                });

                let mailDetails = {
                    from: 'balwellbeingllc@gmail.com',
                    to: ee,
                    subject: 'Reset password OTP For Dr. Desh',
                    text: 'One time OTP is ' + ott
                };
                mailTransporter.sendMail(mailDetails, function (err, data) {
                    if (err) {
                        logger.error("error occur while sending OTP");
                        console.log('mailDetails', mailDetails)
                        console.log('Error Occurs'+ err);
                    } else {
                        logger.info("Email Sent Successfully for otp");
                        console.log('Email sent successfully');
                    }
                });
            }
        }
    })
})
// otp ends

// login starts
router.post("/login", (req, res) => {
    var user = req.body;
    userModel.findOne({ email: user.email }, (err, doc) => {
        if (err) {
            logger.error("Error in LOGIN " + err);
            console.log(err);
        } else {
            if (!doc) {
                logger.info("Invalid Email " + user.email);
                res.status(401).send('Invalid Email')
            } else {
                bcrypt.compare(user.pwd, doc.pwd).then((result) => {
                    if (!result) {
                        logger.info("Invalid password email " + user.email);
                        res.status(401).send('Invalid Password')
                    } else {
                       let role = doc.userrole
                        let payload = { subject: doc._id }
                        let token = jwt.sign(payload, 'keysecret')
                        res.status(200).send({ token,
                        role})
                    }
                });
            }
        }
    })
});
// login ends

// adding new patient starts
router.post('/basedata', verifyToken, (req, res) => {
    let data = req.body;
    let basedata = new MasterPatientModel(data);
    console.log("basedata up"+basedata);
    MasterPatientModel.findOne({  name: basedata.name,dob: new Date(basedata.dob) }).then(res=>{
        if(res == null){
            if(!basedata.patientcreatedon){
            basedata.patientcreatedon = new Date();
             }
             if(!basedata.patientcreatedby){
            basedata.patientcreatedby = currentuser;
             }
            basedata.save().then(res => {
                logger.info("new patient saved to db " + basedata.name);
                console.log("saved to db");
            }, err => {
                console.log(err);
                logger.error("Error in saving new patient " + err);
                res.send("errors in save");
            })
        }
        else{
            logger.info("patient already exists " + basedata.name);
            console.log("patient already exists");
            // res.send("patient already exists");
        }
    },err=>{
        logger.error("Error in saving new patient " + err);
        console.log(err);
    })
})
// adding new patient ends


router.get('/get', verifyToken, (req, res) => {
    MasterPatientModel.findById(req.query.id).then(doc => {
        console.log(doc.dob)
        console.log(doc.name)
        if (doc.visits.length > 0) {
            console.log("visits not null", doc.visits[doc.visits.length - 1])
            res.json({ visit: doc.visits[doc.visits.length - 1], name: doc.name, dob: doc.dob });
        }
        else {
            console.log("visits null", doc)
            res.json(doc)
        }
    }, err => {
        res.json(err);
    })
})

// pre rounding report start
router.post('/preround', verifyToken,async (req, res) => {
   try{
    //    provider details
    const provider_details = await ProviderModel.find({ name: req.body.provider });
    console.log("Provider Details " + provider_details);
    // services eligible medmanage psythreapy psyscreen
    // very urgent patient
    const veryurgent_patients = await MasterPatientModel.aggregate([
        { $project: {name:1,type:"Very Urgent Patient",visits: { $slice : [ "$visits" , -1 ] } } },
        { $match: {'visits.facility': req.body.facility ,'visits.medfollowup':"Very Urgent",
        } }
    ])
    console.log("very urgent"+ veryurgent_patients);
    // urgent patient
    const urgent_patients = await MasterPatientModel.aggregate([
        { $project: {name:1,type:"Urgent Patient", visits: { $slice : [ "$visits" , -1 ] } } },
        { $match: {'visits.facility': req.body.facility ,'visits.medfollowup':"Urgent", "$or":[
            {
            'visits.pinsurance':{ "$in" : provider_details[0].insurance}
            },{
            'visits.sinsurance':{ "$in" : provider_details[0].insurance}
            }]
                }
        }
    ])
    console.log("urgent patients" +urgent_patients);
    // patient fetching according to specific date , we are taking specific date from field "followupdays" from masterpatient model
    const specific_date = await MasterPatientModel.aggregate([
        { $project: {name:1,type:"Date Specific", visits: { $slice : [ "$visits" , -1 ] } } },
        { $match: {'visits.facility': req.body.facility ,
                   'visits.typevisit': { "$in" : provider_details[0].role } ,
                   'visits.followupdays': { "$lte" : new Date(req.body.date ) },
                   "$or":[
                    {
                    'visits.pinsurance':{ "$in" : provider_details[0].insurance}
                    },{
                    'visits.sinsurance':{ "$in" : provider_details[0].insurance}
                    }]
                }
        }
    ])
    console.log("specific date" + specific_date);
    // psychotherapy result

    const psychotherapy_result =  await MasterPatientModel.aggregate([
        { $project: { name:1,type:"Psychotherapy",visits: { $slice : [ "$visits" , -1 ] } } },
        { $match: {'visits.facility': req.body.facility ,
        // "$and":[
        //             {'visits.typevisit':'Psycothreapy'},
        //             {'visits.typevisit': { "$in" : provider_details[0].role } }
        //        ],
                  }
        }
    ])
    console.log(psychotherapy_result);
    // calculating final psychotherapy result
    const final_psychotherapy_result = [];
    for(i=0;i<psychotherapy_result.length;i++){
        let visitd = new Date(psychotherapy_result[i].visits[0].visit);
        visitd.setHours(visitd.getHours() + (psychotherapy_result[i].visits[0].followup * 24 ));
        inputdate = new Date(req.body.date);
        // var ok = visitd.getFullYear()+'/'+(visitd.getMonth()+1)+'/'+visitd.getDate();
        // var id = inputdate.getFullYear()+'/'+(inputdate.getMonth()+1)+'/'+ inputdate.getDate();
        var nn = provider_details[0].role.includes("Psycothreapy");
        if(inputdate >= visitd && nn == true){
            final_psychotherapy_result.push(psychotherapy_result[i]);
        }
        else{
            // console.log("no");
        }
    }
    // per routine protocol
    const final_per_routine_protocol = [];
    const per_routine_protocol = await MasterPatientModel.aggregate([
        { $project: {name:1,type:"Per Routine Protocol", visits: { $slice:[ "$visits",-1] } } },
        { $match: {'visits.facility':req.body.facility ,
                   'visits.medfollowup': 'Per routine protocol',
                   'visits.nextvisitdate': { "$lte" : new Date(req.body.date ) },
    } }
    ])
    for(let p=0;p<per_routine_protocol.length;p++){
        var nnn = provider_details[0].role.includes("Med-management follow up");
        if(nnn==true){
            final_per_routine_protocol.push(per_routine_protocol[p]);
        }
    }

    // pending scales check what provider offers
    const pending_scales = await MasterPatientModel.aggregate([
        { $project: {name:1,type:"Pending scales",pendings:[], visits: { $slice:[ "$visits",-1] } } },
        { $match: {'visits.facility':req.body.facility ,
                    'visits.scaleinfo.1':{ $exists: true },
    } }
    ])
    const final_pending_scales = [];
    for(j=0;j<pending_scales.length;j++){
        var pending = [];
        var flag = true;
        for(k=0;k<pending_scales[j].visits[0].scaleinfo.length;k++){
            // console.log(pending_scales[j].visits[0].scaleinfo[k].scale_name);
            if(pending_scales[j].visits[0].scaleinfo[k].scale_score == "" || pending_scales[j].visits[0].scaleinfo[k].scale_score == null || pending_scales[j].visits[0].scaleinfo[k].scale_score == undefined
              || pending_scales[j].visits[0].scaleinfo[k].scale_date == "" || pending_scales[j].visits[0].scaleinfo[k].scale_date==null||pending_scales[j].visits[0].scaleinfo[k].scale_date==undefined){
                pending.push(pending_scales[j].visits[0].scaleinfo[k].scale_name);
                pending_scales[j].pendings.push(pending_scales[j].visits[0].scaleinfo[k].scale_name);
                flag = false;
              }
        }

        var n = provider_details[0].role.includes("Case Management/Psychiatric screenings");
        if(flag == false && pending_scales[j].pendings.length>0  && n == true){
        final_pending_scales.push(pending_scales[j]);
        }
    }


    // repeated scales
    const repeated_scales = await MasterPatientModel.aggregate([
        { $project: {name:1,type:"Repeated scales",repeated:[], visits: { $slice:[ "$visits",-1] } } },
        { $match: {'visits.facility':req.body.facility ,
                    'visits.scaleinfo.1':{ $exists: true },
    } }
    ])
    const final_repeated_scales = [];
    for(j=0;j<repeated_scales.length;j++){
        var repeat = [];
        var flag = true;
        console.log(repeated_scales[j].name);
        for(k=0;k<repeated_scales[j].visits[0].scaleinfo.length;k++){
            console.log(repeated_scales[j].visits[0].scaleinfo[k].scale_name);
            if(repeated_scales[j].visits[0].scaleinfo[k].scaledays == "3 Months" || repeated_scales[j].visits[0].scaleinfo[k].scaledays == "6 Months" ){
                console.log(repeated_scales[j].visits[0].scaleinfo[k].scale_date);
                var calculate_scale_date =  new Date(repeated_scales[j].visits[0].scaleinfo[k].scale_date);
                console.log(calculate_scale_date + "before");
                if(repeated_scales[j].visits[0].scaleinfo[k].scaledays == "3 Months"){
                calculate_scale_date.setHours(calculate_scale_date.getHours() + (90 * 24 ));
                }
                else if(repeated_scales[j].visits[0].scaleinfo[k].scaledays == "6 Months"){
                    calculate_scale_date.setHours(calculate_scale_date.getHours() + (180 * 24 ));
                    }
                console.log(calculate_scale_date + "after");
                var input_date = new Date(req.body.date);
                console.log(input_date + "input date");
                if(input_date >= calculate_scale_date){
                    repeat.push(repeated_scales[j].visits[0].scaleinfo[k].scale_name);
                    repeated_scales[j].repeated.push(repeated_scales[j].visits[0].scaleinfo[k].scale_name);
                    flag = false;
                }
            }
        }

        var n = provider_details[0].role.includes("Case Management/Psychiatric screenings");
        if(flag == false && repeated_scales[j].repeated.length>0  && n == true){
        final_repeated_scales.push(repeated_scales[j]);
        }
    }

    // adding full result at one place
    const result = [...veryurgent_patients , ...urgent_patients , ...specific_date , ...final_psychotherapy_result, ...final_per_routine_protocol , ...final_pending_scales , ...final_repeated_scales];

    // const uniqueAddresses = Array.from(new Set(result.map(a => a.name)))
    // .map(name => {
    //   return result.find(a => a.name === name)
    // })
    // console.log(uniqueAddresses);
    console.log(result.length);
    for(var i=0;i<result.length;i++){
        for(var j=0;j<result.length;j++){
            if(result[i].name == result[j].name && i!=j){
                result[i].type = result[i].type + " , " + result[j].type;
                if(result[j].type == "Pending scales"){
                    result[i].pendings = result[j].pendings;
                }
                result.splice(j,1);
            }
        }
    }
    res.json(result);
    logger.info("Pre-rounding report got created");

}catch(error){
    logger.error("Error in creating pre-rounding report " + error);
    console.log(error);
   }
})
// pre rounding report ends

// post rounding report starts
router.post('/postreport', verifyToken, (req, res) => {
    let nextDate = new Date(req.body.date);
    nextDate.setDate(nextDate.getDate() + 1);
    MasterPatientModel.find(
        {
            "visits.visit": { $gte: new Date(req.body.date), "$lt": new Date(nextDate) }
        }
    ).then(ma => {
        console.log(ma);
    })
    MasterPatientModel.find(
        {
            "visits.provider": req.body.provider,
            "visits.facility": req.body.facility,
            "visits.visit": { $gte: new Date(req.body.date), "$lt": new Date(nextDate) }
        }, { name: 1, visits: { $slice: -1 } }
    ).then(log => {
        logger.info("Post rounding generated report");
        res.json(log);
    }).catch(err => {
        logger.error("Error in creating Post rounding report");
        res.json(err)
    })
})
// post rounding report ends

// provider performance report starts
router.post('/providerperformancereport', verifyToken, (req, res) => {
    from = new Date(req.body.fromdate);
    to = new Date(req.body.todate);
    to.setHours(to.getHours() + 24);
    provider_name = req.body.provider1;
    var proreport = [{
        facility_name: '',
        no_of_patients_seen: 0,
        points_seen: 0,
        meds_added: 0,
        meds_lowered: 0,
        meds_increased: 0,
        meds_added_with_stop_date: 0,
        meds_continued_but_added_stop_date: 0,
        meds_stopped: 0,
        scales_performed: 0,
        scales_details: [{
            scale_name: '',
            count: 0,
            average_score: 0
        }],
        number_of_each_subscale_performed: 0,
        average_score_of_each_scale: 0,
    }]
    console.log(new Date(req.body.fromdate) + " " + new Date(req.body.todate))
    MasterPatientModel.find({  'visits.provider': req.body.provider1, 'visits.visit': { "$gte": new Date(req.body.fromdate), "$lte": to } })
        .then(doc => {
            if (doc.length != 0) {
                proreport = genreport(doc, proreport);
                setTimeout(() => {
                    res.json(proreport);
                    logger.info("Provider performance report created");
                }, 1000)
            }
            else {
                logger.error("Error in creating provider performance report");
                res.json("no");
            }
        })

        MasterPatientModel.aggregate([
            {$group: {
                _id : {name:"$name"},
                uniqueIds: {$addToSet: "$_id"},
                count : {$sum:1}
            }
        },
        {$match: {
            count: {"$gt": 1}
            }
        },
        {$sort: {
            count: -1
            }
        }
        ]).then(doc=>{
            console.log(doc);
        })
})
// provider performance report ends

// funcction for creating provider performance report start
function genreport(doc, proreport) {
    var total = doc.length - 1;
    firstvisit = false;
    if (doc[0].visits.length == 1) {
        firstvisit = true;
    }
    var flag = 0;
    while (total >= 0) {
        var totalvisits = doc[total].visits.length - 1;
        while (totalvisits >= 0) {
            if (doc[total].visits[totalvisits].visit >= from && doc[total].visits[totalvisits].visit <= to && doc[total].visits[totalvisits].provider == provider_name) {
                var finalsize = proreport.length - 1;
                var workon = 0;
                for (i = 0; i <= finalsize; i++) {
                    if (proreport[i].facility_name != doc[total].visits[totalvisits].facility && i == finalsize && flag != 0) {
                        proreport.push({
                            facility_name: '',
                            no_of_patients_seen: 0,
                            points_seen: 0,
                            meds_added: 0,
                            meds_lowered: 0,
                            meds_increased: 0,
                            meds_added_with_stop_date: 0,
                            meds_continued_but_added_stop_date: 0,
                            meds_stopped: 0,
                            scales_performed: 0,
                            scales_details: [{
                                scale_name: '',
                                count: 0,
                                average_score: 0
                            }],
                            number_of_each_subscale_performed: 0,
                            average_score_of_each_scale: 0,
                        });
                        // console.log("new object bnata " + proreport.length + " after new object");
                        workon = proreport.length - 1;
                        // console.log(workon);
                        break;
                    }
                    else if (proreport[i].facility_name == doc[total].visits[totalvisits].facility) {
                        workon = i;
                        // console.log("found exisiting object for this facility at positon " + workon);
                        break;
                    }
                    else if (finalsize == 0 && flag == 0) {
                        workon = i;
                        // console.log("first time visit");
                        flag = 1;
                        break;
                    }
                }

                console.log("all codition got fullfilled at patient NO : " + total + " patient's name " + doc[total].name + " at visit no : " + totalvisits
                + " patient's provider is " +  doc[total].visits[totalvisits].provider + " patient faciliyt is "+ doc[total].visits[totalvisits].facility +
                " Type of visit : " + doc[total].visits[totalvisits].typevisit + " visit date is : " + doc[total].visits[totalvisits].visit);
                // patients seen
                proreport[workon].no_of_patients_seen = proreport[workon].no_of_patients_seen + 1;
                // setting facility
                if (doc[total].visits[totalvisits].facility != undefined && doc[total].visits[totalvisits].facility != null && doc[total].visits[totalvisits].facility != "") {
                    proreport[workon].facility_name = doc[total].visits[totalvisits].facility;
                }
                // checking for new patient
                if (doc[total].visits[totalvisits].np == "yes" && doc[total].visits[totalvisits].np != undefined) {
                    proreport[workon].points_seen = proreport[workon].points_seen + 2;
                }
                // checking for medication management follow up
                if (doc[total].visits[totalvisits].typevisit == "Med-management follow up" && doc[total].visits[totalvisits].typevisit != undefined) {
                    proreport[workon].points_seen = proreport[workon].points_seen + 1;
                }
                // checking for atleast two
                // console.log(doc[total].visits[totalvisits].scaleinfo.length + "visit no" + totalvisits);
                var scale_size = doc[total].visits[totalvisits].scaleinfo.length - 1;
                if (doc[total].visits[totalvisits].scaleinfo.length >= 2 && doc[total].visits[totalvisits].scaleinfo != undefined) {
                    proreport[workon].points_seen = proreport[workon].points_seen + 1.5;
                    flag = true;
                    // adding 2.5 score if scales have Dementia testing scale
                    while (scale_size >= 0 && flag == true) {
                        if (doc[total].visits[totalvisits].scaleinfo[scale_size].scale_name == "MOCA") {
                            proreport[workon].points_seen = proreport[workon].points_seen + 2.5;
                            flag = false;
                        }
                        scale_size--;
                    }
                }
                // Psychotherapy points
                if (doc[total].visits[totalvisits].thtime == "Upto 30 min") {
                    proreport[workon].points_seen = proreport[workon].points_seen + 1;
                }
                if (doc[total].visits[totalvisits].thtime == "Upto 45 min") {
                    proreport[workon].points_seen = proreport[workon].points_seen + 1.5;
                }
                if (doc[total].visits[totalvisits].thtime == "Upto 1 Hr") {
                    proreport[workon].points_seen = proreport[workon].points_seen + 2;
                }
                if (doc[total].visits[totalvisits].thtime == "More then 1 Hr") {
                    proreport[workon].points_seen = proreport[workon].points_seen + 2.5;
                }
                // console.log(doc[total].visits[totalvisits].medstopdate + "Med Stop Date");
                // medicine continued but addded stop date
                if (firstvisit == true && doc[total].visits[totalvisits].medstopdate != undefined && doc[total].visits[totalvisits].medstopdate != "") {
                    if (doc[total].visits[totalvisits].medstopdate != null) {
                        proreport[workon].meds_continued_but_added_stop_date = proreport[workon].meds_continued_but_added_stop_date + 1;
                    }
                }
                else if (totalvisits - 1 >= 0 && doc[total].visits[totalvisits].medstopdate != undefined && doc[total].visits[totalvisits].medstopdate != "") {
                    if (doc[total].visits[totalvisits].medstopdate != doc[total].visits[totalvisits - 1].medstopdate && doc[total].visits[totalvisits].medstopdate != "") {
                        proreport[workon].meds_continued_but_added_stop_date = proreport[workon].meds_continued_but_added_stop_date + 1;
                    }
                }
                else if (doc[total].visits[totalvisits].medstopdate != undefined && doc[total].visits[totalvisits].medstopdate != "" && totalvisits > 0) {
                    if (doc[total].visits[totalvisits].medstopdate != doc[total].visits[totalvisits + 1].medstopdate && doc[total].visits[totalvisits].medstopdate != "") {
                        proreport[workon].meds_continued_but_added_stop_date = proreport[workon].meds_continued_but_added_stop_date + 1;
                    }
                }
                // console.log(doc[total].visits[totalvisits].addeddate + " Added DateDate");
                // stop date of added medicine
                if (firstvisit == true && doc[total].visits[totalvisits].addeddate != undefined && doc[total].visits[totalvisits].addeddate != "") {
                    if (doc[total].visits[totalvisits].addeddate != null) {
                        proreport[workon].meds_added_with_stop_date = proreport[workon].meds_added_with_stop_date + 1;
                    }
                }
                else if (totalvisits - 1 >= 0 && doc[total].visits[totalvisits].addeddate != undefined && doc[total].visits[totalvisits].addeddate != "") {
                    if (doc[total].visits[totalvisits].addeddate != doc[total].visits[totalvisits - 1].addeddate && doc[total].visits[totalvisits].addeddate != "") {
                        proreport[workon].meds_added_with_stop_date = proreport[workon].meds_added_with_stop_date + 1;
                    }
                }
                else if (doc[total].visits[totalvisits].addeddate != undefined && doc[total].visits[totalvisits].addeddate != "" && totalvisits > 0) {
                    if (doc[total].visits[totalvisits].addeddate != doc[total].visits[totalvisits + 1].addeddate && doc[total].visits[totalvisits].addeddate != "") {
                        proreport[workon].meds_added_with_stop_date = proreport[workon].meds_added_with_stop_date + 1;
                    }
                }
                // console.log(doc[total].visits[totalvisits].added+"added");
                // Added Medicine
                if (firstvisit == true && doc[total].visits[totalvisits].added != undefined && doc[total].visits[totalvisits].added != "") {
                    if (doc[total].visits[totalvisits].added != null || doc[total].visits[totalvisits].added != undefined) {
                        proreport[workon].meds_added = proreport[workon].meds_added + 1;
                    }
                }
                else if (totalvisits - 1 >= 0 && doc[total].visits[totalvisits].added != undefined && doc[total].visits[totalvisits].added != "") {
                    if (doc[total].visits[totalvisits].added != doc[total].visits[totalvisits - 1].added && doc[total].visits[totalvisits].added != "") {
                        proreport[workon].meds_added = proreport[workon].meds_added + 1;
                    }
                }
                else if (doc[total].visits[totalvisits].added != undefined && doc[total].visits[totalvisits].added != "" && totalvisits > 0) {
                    if (doc[total].visits[totalvisits].added != doc[total].visits[totalvisits + 1].added && doc[total].visits[totalvisits].added != "") {
                        proreport[workon].meds_added = proreport[workon].meds_added + 1;
                    }
                }
                // console.log(doc[total].visits[totalvisits].increase + " increase ");
                // Increased Medicine
                if (doc[total].visits[totalvisits].increase != undefined && doc[total].visits[totalvisits].increase != "") {

                    if (firstvisit == true) {
                        if (doc[total].visits[totalvisits].increase != null || doc[total].visits[totalvisits].increase != undefined) {
                            proreport[workon].meds_increased = proreport[workon].meds_increased + 1;
                        }
                    }
                    else if (totalvisits - 1 >= 0 && doc[total].visits[totalvisits].increase != undefined && doc[total].visits[totalvisits].increase != "") {
                        if (doc[total].visits[totalvisits].increase != doc[total].visits[totalvisits - 1].increase && doc[total].visits[totalvisits].increase != "") {
                            proreport[workon].meds_increased = proreport[workon].meds_increased + 1;
                        }
                    }
                    else if (doc[total].visits[totalvisits].increase != undefined && doc[total].visits[totalvisits].increase != "" && totalvisits > 0) {
                        if (doc[total].visits[totalvisits].increase != doc[total].visits[totalvisits + 1].increase && doc[total].visits[totalvisits].increase != "") {
                            proreport[workon].meds_increased = proreport[workon].meds_increased + 1;
                        }
                    }
                }
                // console.log(doc[total].visits[totalvisits].stopped2 + " stopped2 ");
                // Stopped Medicine
                if (firstvisit == true && doc[total].visits[totalvisits].stopped2 != undefined && doc[total].visits[totalvisits].stopped2 != "") {
                    if (doc[total].visits[totalvisits].stopped2 != null || doc[total].visits[totalvisits].stopped2 != undefined) {
                        proreport[workon].meds_stopped = proreport[workon].meds_stopped + 1;
                    }
                }
                else if (totalvisits - 1 >= 0 && doc[total].visits[totalvisits].stopped2 != undefined && doc[total].visits[totalvisits].stopped2 != "") {
                    if (doc[total].visits[totalvisits].stopped2 != doc[total].visits[totalvisits - 1].stopped2 && doc[total].visits[totalvisits].stopped2 != "") {
                        proreport[workon].meds_stopped = proreport[workon].meds_stopped + 1;
                    }
                }
                else if (doc[total].visits[totalvisits].stopped2 != undefined && doc[total].visits[totalvisits].stopped2 != "" && totalvisits >0) {
                    if (doc[total].visits[totalvisits].stopped2 != doc[total].visits[totalvisits + 1].stopped2 && doc[total].visits[totalvisits].stopped2 != "") {
                        proreport[workon].meds_stopped = proreport[workon].meds_stopped + 1;
                        }
                }
                else{
                }
                // console.log(doc[total].visits[totalvisits].decrease2 + " Decrease2 ");
                // meds lowered or decreased
                if (firstvisit == true && doc[total].visits[totalvisits].decrease2 != undefined && doc[total].visits[totalvisits].decrease2 != "") {
                    if (doc[total].visits[totalvisits].decrease2 != null || doc[total].visits[totalvisits].decrease2 != undefined) {
                        proreport[workon].meds_lowered = proreport[workon].meds_lowered + 1;
                    }
                }
                else if (totalvisits - 1 >= 0 && doc[total].visits[totalvisits].decrease2 != undefined && doc[total].visits[totalvisits].decrease2 != "") {
                    if (doc[total].visits[totalvisits].decrease2 != doc[total].visits[totalvisits - 1].decrease2 && doc[total].visits[totalvisits].decrease2 != "") {
                        proreport[workon].meds_lowered = proreport[workon].meds_lowered + 1;
                    }
                }
                else if (doc[total].visits[totalvisits].decrease2 != undefined && doc[total].visits[totalvisits].decrease2 != "" && totalvisits > 0) {
                    if (doc[total].visits[totalvisits].decrease2 != doc[total].visits[totalvisits + 1].decrease2 && doc[total].visits[totalvisits].decrease2 != "") {
                        proreport[workon].meds_lowered = proreport[workon].meds_lowered + 1;
                    }
                }
                // console.log(doc[total].visits[totalvisits].scaleinfo.length + "ScaleInfo");
                // scales performed
                if (firstvisit == true && doc[total].visits[totalvisits].scaleinfo.length != 0) {
                    if (doc[total].visits[totalvisits].scaleinfo.length != null || doc[total].visits[totalvisits].scaleinfo.length != undefined) {
                        proreport[workon].scales_performed = proreport[workon].scales_performed + doc[total].visits[totalvisits].scaleinfo.length;
                    }
                }
                else if (totalvisits - 1 >= 0 && doc[total].visits[totalvisits].scaleinfo.length != 0) {
                    if (doc[total].visits[totalvisits].scaleinfo.length != doc[total].visits[totalvisits - 1].scaleinfo.length) {
                        if (doc[total].visits[totalvisits].scaleinfo.length > doc[total].visits[totalvisits - 1].scaleinfo.length) {
                            add = doc[total].visits[totalvisits].scaleinfo.length - doc[total].visits[totalvisits - 1].scaleinfo.length;
                        }
                        else {
                            add = 0;
                        }
                        proreport[workon].scales_performed = proreport[workon].scales_performed + add;
                    }
                }
                else if (doc[total].visits[totalvisits].scaleinfo.length != 0) {
                    if(totalvisits > 0){
                    if (doc[total].visits[totalvisits].scaleinfo.length != doc[total].visits[totalvisits + 1].scaleinfo.length) {
                        if(totalvisits > 0){
                        if (doc[total].visits[totalvisits].scaleinfo.length > doc[total].visits[totalvisits - 1].scaleinfo.length) {
                            add = doc[total].visits[totalvisits].scaleinfo.length - doc[total].visits[totalvisits - 1].scaleinfo.length;
                        }
                        else {
                            add = 0;
                        }
                    }
                    else {
                        add = 0;
                    }
                        proreport[workon].scales_performed = proreport[workon].scales_performed + add;
                    }
                }
                }
                // console.log("abcdefghijklmnopqrstuvwxyz");
                var scale_length = doc[total].visits[totalvisits].scaleinfo.length;
                // console.log("scales scale length : " + scale_length);
                var ff = 0;
                for (k = 0; k < scale_length; k++) {
                    // console.log(doc[total].visits[totalvisits].scaleinfo[k].scale_name);
                    // console.log(proreport[workon].scales_details.length - 1);
                    // console.log("error kidr hai ? 1");
                    for (p = 0; p <= proreport[workon].scales_details.length - 1; p++) {
                        // console.log("error kidr hai ? 2 " + k + " " + p);
                        if (proreport[workon].scales_details.length == 1 && ff == 0) {
                            // console.log("error kidr hai ? 3");
                            // console.log("first scale to be added in record");
                            proreport[workon].scales_details[p].scale_name = doc[total].visits[totalvisits].scaleinfo[k].scale_name;
                            proreport[workon].scales_details[p].count = proreport[workon].scales_details[p].count + 1;
                            ff = 1;
                            break;
                        }
                        else if (proreport[workon].scales_details[p].scale_name == doc[total].visits[totalvisits].scaleinfo[k].scale_name) {
                            // console.log("error kidr hai ? 4");
                            if (totalvisits > 0) {
                                var isPresent = doc[total].visits[totalvisits - 1].scaleinfo.some((el) => {
                                    if (el.scale_name === proreport[workon].scales_details[p].scale_name) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });
                                if (isPresent == false) {
                                    // console.log("error kidr hai ? 5");
                                    // console.log("pata nh");
                                    proreport[workon].scales_details[p].count = proreport[workon].scales_details[p].count + 1;
                                }
                            }
                            // console.log("same record");
                            break;
                        }
                        else if (proreport[workon].scales_details[p].scale_name != doc[total].visits[totalvisits].scaleinfo[k].scale_name && p == proreport[workon].scales_details.length - 1) {
                            // console.log("new record for scale");
                            // console.log("error kidr hai ? 6");
                            // console.log(proreport[workon].scales_details.length - 1);
                            proreport[workon].scales_details.push({
                                scale_name: doc[total].visits[totalvisits].scaleinfo[k].scale_name,
                                count: 1,
                                average_score: 0
                            })
                            break;
                        }
                    }
                }
            }
            totalvisits--;
        }
        // console.log(proreport[workon].scales_details);
        total--;
    }
    // console.log(proreport);
    return proreport;
}
// function for creating provider performance report ends

// facility report start
router.post('/facilityreport', verifyToken, (req, res) => {
    from = new Date(req.body.fromdate1);
    to = new Date(req.body.todate1);
    to.setHours(to.getHours() + 24);
    facility_name = req.body.facility1;
    var proreport = [{
        provider_name: '',
        no_of_patients_seen: 0,
        points_seen: 0,
        meds_added: 0,
        meds_lowered: 0,
        meds_increased: 0,
        meds_added_with_stop_date: 0,
        meds_continued_but_added_stop_date: 0,
        meds_stopped: 0,
        scales_performed: 0,
        scales_details: [{
            scale_name: '',
            count: 0,
            average_score: 0
        }],
        number_of_each_subscale_performed: 0,
        average_score_of_each_scale: 0,
    }]
    MasterPatientModel.find({ 'visits.facility': req.body.facility1, 'visits.visit': { "$gte": new Date(req.body.fromdate1), "$lte": to } })
        .then(doc => {
            if (doc.length != 0) {
                proreport = genreport2(doc, proreport);
                setTimeout(() => {
                    // console.log(proreport);
                    res.json(proreport);
                    logger.info("facility report generated");
                }, 1000)
            }
            else {
                logger.error("Error in generating facility report");
                res.json("no");
            }
        })
})
// facility report ends

// function for creating facility report starts
function genreport2(doc, proreport) {
    var total = doc.length - 1;
    // console.log(proreport.length);
    firstvisit = false;
    if (doc[0].visits.length == 1) {
        firstvisit = true;
    }
    var flag = 0;
    while (total >= 0) {
        var totalvisits = doc[total].visits.length - 1;
        while (totalvisits >= 0) {
            if (doc[total].visits[totalvisits].visit >= from && doc[total].visits[totalvisits].visit <= to && doc[total].visits[totalvisits].facility == facility_name) {
                var finalsize = proreport.length - 1;
                var workon = 0;
                for (i = 0; i <= finalsize; i++) {
                    if (proreport[i].provider_name != doc[total].visits[totalvisits].provider && i == finalsize && flag != 0) {
                        proreport.push({
                            provider_name: '',
                            no_of_patients_seen: 0,
                            points_seen: 0,
                            meds_added: 0,
                            meds_lowered: 0,
                            meds_increased: 0,
                            meds_added_with_stop_date: 0,
                            meds_continued_but_added_stop_date: 0,
                            meds_stopped: 0,
                            scales_performed: 0,
                            scales_details: [{
                                scale_name: '',
                                count: 0,
                                average_score: 0
                            }],
                            number_of_each_subscale_performed: 0,
                            average_score_of_each_scale: 0,
                        });
                        // console.log("new object bnata " + proreport.length + " after new object");
                        workon = proreport.length - 1;
                        // console.log(workon);
                        break;
                    }
                    else if (proreport[i].provider_name == doc[total].visits[totalvisits].provider) {
                        workon = i;
                        // console.log("found exisiting object for this provider at positon " + workon);
                        break;
                    }
                    else if (finalsize == 0 && flag == 0) {
                        workon = i;
                        // console.log("first time visit");
                        flag = 1;
                        break;
                    }
                }
                console.log("all codition got fullfilled at patient NO : " + total + " patient's name " + doc[total].name + " at visit no : " + totalvisits
                + " patient's provider is " +  doc[total].visits[totalvisits].provider + " patient faciliyt is "+ doc[total].visits[totalvisits].facility +
                " Type of visit : " + doc[total].visits[totalvisits].typevisit + " visit date is : " + doc[total].visits[totalvisits].visit);
                // patients seen
                proreport[workon].no_of_patients_seen = proreport[workon].no_of_patients_seen + 1;
                // setting provider
                if (doc[total].visits[totalvisits].provider != undefined && doc[total].visits[totalvisits].provider != null && doc[total].visits[totalvisits].provider != "") {
                    proreport[workon].provider_name = doc[total].visits[totalvisits].provider;
                }
                // checking for new patient
                if (doc[total].visits[totalvisits].np == "yes" && doc[total].visits[totalvisits].np != undefined) {
                    proreport[workon].points_seen = proreport[workon].points_seen + 2;
                }
                // checking for medication management follow up
                if (doc[total].visits[totalvisits].typevisit == "Med-management follow up" && doc[total].visits[totalvisits].typevisit != undefined) {
                    proreport[workon].points_seen = proreport[workon].points_seen + 1;
                }
                // checking for atleast two
                // console.log(doc[total].visits[totalvisits].scaleinfo.length + "visit no" + totalvisits);
                var scale_size = doc[total].visits[totalvisits].scaleinfo.length - 1;
                if (doc[total].visits[totalvisits].scaleinfo.length >= 2 && doc[total].visits[totalvisits].scaleinfo != undefined) {

                    proreport[workon].points_seen = proreport[workon].points_seen + 1.5;
                    flag = true;
                    // adding 2.5 score if scales have Dementia testing scale
                    while (scale_size >= 0 && flag == true) {
                        if (doc[total].visits[totalvisits].scaleinfo[scale_size].scale_name == "MOCA") {
                            proreport[workon].points_seen = proreport[workon].points_seen + 2.5;
                            flag = false;
                        }
                        scale_size--;
                    }
                }
                // Psychotherapy points
                if (doc[total].visits[totalvisits].thtime == "Upto 30 min") {
                    proreport[workon].points_seen = proreport[workon].points_seen + 1;
                }
                if (doc[total].visits[totalvisits].thtime == "Upto 45 min") {
                    proreport[workon].points_seen = proreport[workon].points_seen + 1.5;
                }
                if (doc[total].visits[totalvisits].thtime == "Upto 1 Hr") {
                    proreport[workon].points_seen = proreport[workon].points_seen + 2;
                }
                if (doc[total].visits[totalvisits].thtime == "More then 1 Hr") {
                    proreport[workon].points_seen = proreport[workon].points_seen + 2.5;
                }
                // medicine continued but addded stop date
                if (firstvisit == true && doc[total].visits[totalvisits].medstopdate != undefined) {
                    if (doc[total].visits[totalvisits].medstopdate != null) {
                        proreport[workon].meds_continued_but_added_stop_date = proreport[workon].meds_continued_but_added_stop_date + 1;
                    }
                }
                else if (totalvisits - 1 >= 0 && doc[total].visits[totalvisits].medstopdate != undefined) {
                    if (doc[total].visits[totalvisits].medstopdate != doc[total].visits[totalvisits - 1].medstopdate && doc[total].visits[totalvisits].medstopdate != "") {
                        proreport[workon].meds_continued_but_added_stop_date = proreport[workon].meds_continued_but_added_stop_date + 1;
                    }
                }
                else if (doc[total].visits[totalvisits].medstopdate != undefined && totalvisits > 0) {
                    if (doc[total].visits[totalvisits].medstopdate != doc[total].visits[totalvisits + 1].medstopdate && doc[total].visits[totalvisits].medstopdate != "") {
                        proreport[workon].meds_continued_but_added_stop_date = proreport[workon].meds_continued_but_added_stop_date + 1;
                    }
                }
                // stop date of added medicine
                if (firstvisit == true && doc[total].visits[totalvisits].addeddate != undefined) {
                    console.log("1");
                    if (doc[total].visits[totalvisits].addeddate != null) {
                        proreport[workon].meds_added_with_stop_date = proreport[workon].meds_added_with_stop_date + 1;
                        console.log("2");
                    }
                }
                else if (totalvisits - 1 >= 0 && doc[total].visits[totalvisits].addeddate != undefined) {
                    console.log("3");
                    if (doc[total].visits[totalvisits].addeddate != doc[total].visits[totalvisits - 1].addeddate && doc[total].visits[totalvisits].addeddate != "") {
                        console.log("4");
                        proreport[workon].meds_added_with_stop_date = proreport[workon].meds_added_with_stop_date + 1;
                    }
                }
                else if (doc[total].visits[totalvisits].addeddate != undefined && totalvisits > 0) {
                    console.log("5");
                    if (doc[total].visits[totalvisits].addeddate != doc[total].visits[totalvisits + 1].addeddate && doc[total].visits[totalvisits].addeddate != "") {
                        console.log("6");
                        proreport[workon].meds_added_with_stop_date = proreport[workon].meds_added_with_stop_date + 1;
                    }
                }
                // Added Medicine
                if (firstvisit == true && doc[total].visits[totalvisits].added != undefined) {
                    if (doc[total].visits[totalvisits].added != null || doc[total].visits[totalvisits].added != undefined) {
                        proreport[workon].meds_added = proreport[workon].meds_added + 1;
                    }
                }
                else if (totalvisits - 1 >= 0 && doc[total].visits[totalvisits].added != undefined) {
                    if (doc[total].visits[totalvisits].added != doc[total].visits[totalvisits - 1].added && doc[total].visits[totalvisits].added != "") {
                        proreport[workon].meds_added = proreport[workon].meds_added + 1;
                    }
                }
                else if (doc[total].visits[totalvisits].added != undefined && totalvisits > 0) {
                    if (doc[total].visits[totalvisits].added != doc[total].visits[totalvisits + 1].added && doc[total].visits[totalvisits].added != "") {
                        proreport[workon].meds_added = proreport[workon].meds_added + 1;
                    }
                }
                // Increased Medicine
                if (firstvisit == true && doc[total].visits[totalvisits].increase != undefined) {
                    console.log("1");
                    if (doc[total].visits[totalvisits].increase != null || doc[total].visits[totalvisits].increase != undefined) {
                        console.log("2");
                        proreport[workon].meds_increased = proreport[workon].meds_increased + 1;
                    }
                }
                else if (totalvisits - 1 >= 0 && doc[total].visits[totalvisits].increase != undefined) {
                    console.log("3");
                    if (doc[total].visits[totalvisits].increase != doc[total].visits[totalvisits - 1].increase && doc[total].visits[totalvisits].increase != "") {
                        console.log("4");
                        proreport[workon].meds_increased = proreport[workon].meds_increased + 1;
                    }
                }
                else if (doc[total].visits[totalvisits].increase != undefined && totalvisits > 0) {
                    console.log("5");
                    if (doc[total].visits[totalvisits].increase != doc[total].visits[totalvisits + 1].increase && doc[total].visits[totalvisits].increase != "") {
                        console.log("6");
                        proreport[workon].meds_increased = proreport[workon].meds_increased + 1;
                    }
                }
                // Stopped Medicine
                if (firstvisit == true && doc[total].visits[totalvisits].stopped2 != undefined) {
                    if (doc[total].visits[totalvisits].stopped2 != null || doc[total].visits[totalvisits].stopped2 != undefined) {
                        proreport[workon].meds_stopped = proreport[workon].meds_stopped + 1;
                    }
                }
                else if (totalvisits - 1 >= 0 && doc[total].visits[totalvisits].stopped2 != undefined) {
                    if (doc[total].visits[totalvisits].stopped2 != doc[total].visits[totalvisits - 1].stopped2 && doc[total].visits[totalvisits].stopped2 != "") {
                        proreport[workon].meds_stopped = proreport[workon].meds_stopped + 1;
                    }
                }
                else if (doc[total].visits[totalvisits].stopped2 != undefined && totalvisits > 0) {
                    if (doc[total].visits[totalvisits].stopped2 != doc[total].visits[totalvisits + 1].stopped2 && doc[total].visits[totalvisits].stopped2 != "") {
                        proreport[workon].meds_stopped = proreport[workon].meds_stopped + 1;
                    }
                }
                // meds lowered or decreased
                if (firstvisit == true && doc[total].visits[totalvisits].decrease2 != undefined) {
                    if (doc[total].visits[totalvisits].decrease2 != null || doc[total].visits[totalvisits].decrease2 != undefined) {
                        proreport[workon].meds_lowered = proreport[workon].meds_lowered + 1;
                    }
                }
                else if (totalvisits - 1 >= 0 && doc[total].visits[totalvisits].decrease2 != undefined) {
                    if (doc[total].visits[totalvisits].decrease2 != doc[total].visits[totalvisits - 1].decrease2 && doc[total].visits[totalvisits].decrease2 != "") {
                        proreport[workon].meds_lowered = proreport[workon].meds_lowered + 1;
                    }
                }
                else if (doc[total].visits[totalvisits].decrease2 != undefined && totalvisits > 0) {
                    if (doc[total].visits[totalvisits].decrease2 != doc[total].visits[totalvisits + 1].decrease2 && doc[total].visits[totalvisits].decrease2 != "") {
                        proreport[workon].meds_lowered = proreport[workon].meds_lowered + 1;
                    }
                }
                // scales performed
                if (firstvisit == true && doc[total].visits[totalvisits].scaleinfo.length != 0) {
                    console.log("1");
                    if (doc[total].visits[totalvisits].scaleinfo.length != null || doc[total].visits[totalvisits].scaleinfo.length != undefined) {
                        console.log("2");
                        proreport[workon].scales_performed = proreport[workon].scales_performed + doc[total].visits[totalvisits].scaleinfo.length;
                    }
                }
                else if (totalvisits - 1 >= 0 && doc[total].visits[totalvisits].scaleinfo.length != 0) {
                    console.log("3");
                    if (doc[total].visits[totalvisits].scaleinfo.length != doc[total].visits[totalvisits - 1].scaleinfo.length) {
                        console.log("4");
                        if (doc[total].visits[totalvisits].scaleinfo.length > doc[total].visits[totalvisits - 1].scaleinfo.length) {
                            console.log("5");
                            add = doc[total].visits[totalvisits].scaleinfo.length - doc[total].visits[totalvisits - 1].scaleinfo.length;
                        }
                        else {
                            console.log("6");
                            add = 0;
                        }
                        proreport[workon].scales_performed = proreport[workon].scales_performed + add;
                    }
                }
                else if (doc[total].visits[totalvisits].scaleinfo.length != 0 && totalvisits > 0) {
                    console.log("7");
                    if (doc[total].visits[totalvisits].scaleinfo.length != doc[total].visits[totalvisits + 1].scaleinfo.length
                        ) {
                            console.log("8");
                        if (doc[total].visits[totalvisits].scaleinfo.length > doc[total].visits[totalvisits - 1].scaleinfo.length) {
                            console.log("9");
                            add = doc[total].visits[totalvisits].scaleinfo.length - doc[total].visits[totalvisits - 1].scaleinfo.length;
                        }
                        else {
                            console.log("10");
                            add = 0;
                        }
                        proreport[workon].scales_performed = proreport[workon].scales_performed + add;
                    }
                }
                var scale_length = doc[total].visits[totalvisits].scaleinfo.length;
                // console.log("scales");
                var ff = 0;
                for (k = 0; k < scale_length; k++) {
                    // console.log(doc[total].visits[totalvisits].scaleinfo[k].scale_name);
                    // console.log(proreport[workon].scales_details.length - 1);
                    // console.log("error kidr hai ? 1");
                    for (p = 0; p <= proreport[workon].scales_details.length - 1; p++) {
                        // console.log("error kidr hai ? 2 " + k + " " + p);
                        if (proreport[workon].scales_details.length == 1 && ff == 0) {
                            // console.log("error kidr hai ? 3");
                            // console.log("first scale to be added in record");
                            proreport[workon].scales_details[p].scale_name = doc[total].visits[totalvisits].scaleinfo[k].scale_name;
                            proreport[workon].scales_details[p].count = proreport[workon].scales_details[p].count + 1;
                            ff = 1;
                            break;
                        }
                        else if (proreport[workon].scales_details[p].scale_name == doc[total].visits[totalvisits].scaleinfo[k].scale_name) {
                            // console.log("error kidr hai ? 4");
                            if (totalvisits > 0) {
                                var isPresent = doc[total].visits[totalvisits - 1].scaleinfo.some((el) => {
                                    if (el.scale_name === proreport[workon].scales_details[p].scale_name) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });
                                if (isPresent == false) {
                                    // console.log("error kidr hai ? 5");
                                    // console.log("pata nh");
                                    proreport[workon].scales_details[p].count = proreport[workon].scales_details[p].count + 1;
                                }
                            }
                            // console.log("same record");
                            break;
                        }
                        else if (proreport[workon].scales_details[p].scale_name != doc[total].visits[totalvisits].scaleinfo[k].scale_name && p == proreport[workon].scales_details.length - 1) {
                            // console.log("new record for scale");
                            // console.log(proreport[workon].scales_details.length - 1);
                            proreport[workon].scales_details.push({
                                scale_name: doc[total].visits[totalvisits].scaleinfo[k].scale_name,
                                count: 1,
                                average_score: 0
                            })
                            break;
                        }
                    }
                }
            }
            totalvisits--;
        }
        total--;
    }
    // console.log(proreport);
    return proreport;
}
// function for creating facility report ends

// facility summary report starts
router.post('/facilitysummaryreport', verifyToken, (req, res) => {
    var toDateAddTime = new Date(req.body.facilitySummaryTodate);
    toDateAddTime.setHours(toDateAddTime.getHours() + 24);
    MasterPatientModel.aggregate([
                {
                    '$unwind':"$visits"
                },
                {"$match": {"visits.visit": {"$gte": new Date(req.body.facilitySummaryFromdate), "$lte": toDateAddTime
                                            } ,  "visits.facility":  req.body.facilitySummaryName
                           }
                }
    ]).then(doc => {
            if (doc.length != 0) {
                logger.info("facility summary report genrated");
                res.json(doc);
            }
            else {
                logger.info("facility summary report is empty");
                res.json("no");
            }
        })
});
// facility summary reports ends

// expensive medication report starts
router.post('/expensivemedicationreport', verifyToken, (req, res) => {
    MasterPatientModel.aggregate([
        {
            "$project" : {
                "id" : 1,
                "name" : 1,
                "dob" : 1,
                "patientVisits" : {
                    "$slice" : [
                        "$visits",
                        -1
                    ]
                }
            }
        },
        {
            "$match" : {
                "patientVisits.exmeds.name" : req.body.medicineName
            }
        }
    ]).then(doc => {
            if (doc.length != 0) {
                logger.info("Expensive medication report got generated");
                res.json(doc);
            }
            else {
                logger.info("Expensive medication report is empty");
                res.json("no");
            }
        })
});
// expensive medication report ends

// patient summary report start
router.post('/patientsummaryreport', verifyToken, (req, res) => {
    var toDateAddTime = new Date(req.body.patientSummaryTodate);
    toDateAddTime.setHours(toDateAddTime.getHours() + 24);
    MasterPatientModel.aggregate([
                {
                    '$unwind':"$visits"
                },
                {"$match": {"visits.visit": {"$gte": new Date(req.body.patientSummaryFromdate), "$lte": toDateAddTime
                                            } ,  "name":  req.body.patientName
                           }
                }
    ]).then(doc => {
            if (doc.length != 0) {
                logger.info("Patient summary report got generated");
                res.json(doc);
            }
            else {
                logger.info("patient summary report is empty");
                res.json("no");
            }
        })
});
// patient summary report ends

// getting patient data as per key start
router.post('/getpatientsasperkey', verifyToken, (req, res) => {
    MasterPatientModel.find({'name': new RegExp('^'+req.body.enterKey, 'i')},{"name":1, "_id": 0}).then(doc => {
        if (doc.length != 0) {
            res.json(doc);
            logger.info("Get patient data as per id ");
        }
        else {
            logger.info("No data found");
            res.json("no");
        }
    })
});
// getting patient data as per key ends

// getting medicine as per key start
router.post('/getmedicineasperkey', verifyToken, (req, res) => {
    MedicationModel.find({'name': new RegExp('^'+req.body.enterKey, 'i')},{"name":1, "_id": 0}).then(doc => {
        if (doc.length != 0) {
            logger.info("Get medicine as per key id");
            res.json(doc);
        }
        else {
            logger.info("No medicine found as per id");
            res.json("no");
        }
    })
})
// getting medicine as per key ends

// med report start
router.post('/medreport', verifyToken, (req, res) => {
    let nextDate = new Date(req.body.date);
    nextDate.setDate(nextDate.getDate() + 1);
    MasterPatientModel.find(
        {
            "visits.provider": req.body.provider,
            "visits.facility": req.body.facility,
            "visits.nostable": "no",
            "visits.visit": { $gte: new Date(req.body.date), "$lt": new Date(nextDate) }
        }
    ).then(log => {
        let mighty;
        if(log.length)
        FacilityModel.find({ name: req.body.facility }, (err, fac) => {
            if (!err) {
                mighty=fac;
                logger.info("Meds report got generated");
            }
            else {
                logger.error("Meds reports error "+err);
                console.log(err)
            }
        })
        setTimeout(() => {
            console.log(log)
            res.json({log:log,address:mighty});
            logger.info("Meds reports generated");
        }, 1000)
    }).catch(err => {
        logger.error("Meds report error " + err);
        res.json(err)
    })
})
// med report ends

// fetchbyName starts
router.get('/fetchByName', verifyToken, (req, res) => {
    let name = new RegExp(req.query.name);
    MasterPatientModel.find({ "name": new RegExp(name, 'i') }).then(out => {
        res.json(out)
    })
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve("./"+'../')+'/upload/images/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now()+path.extname(file.originalname))
    }
  })

  var upload = multer({ storage: storage });

router.post('/employeedetails', verifyToken, upload.single('file'), (req, res) => {
    const fileName =  req.file !== undefined  ? req.file.filename  : '';
    var employee1 = {
        fiName: fileName,
        status: 'Submited',
        savedon: new Date(),
        savedby: currentuser,
        documentname: req.body.documentname,
        remark: ''
    }

    userModel.find({_id: req.userId, "files.documentname": req.body.documentname}, (err, doc) => {
        if (!err ) {
            if(doc.length == 0) {
                userModel.find({_id: req.userId}, (error, document) => {
                    if(!error) {
                        document[0].files.push(employee1);
                        document[0].save().then(ress => {
                        res.send(document);
                        }, err => {
                            console.log(err);
                        })

                    } else {
                        res.send(error);
                    }

                })
            } else {
                userModel.updateOne({_id: req.userId, 'files.documentname': req.body.documentname}, { $set: { 'files.$.fiName': fileName, 'files.$.savedon': new Date(), 'files.$.status': 'Submited' } }, (errr, docc) => {
                    if(!errr) {
                        res.send(docc);
                    } else {
                        console.log(errr);
                        res.send(errr);
                    }
                })
            }
        }
        else {
            console.log("error at employeedetails", err);
        }
    })

})

router.post('/fetchfiles', verifyToken, (req, res) => {
    userModel.find({_id: req.userId},{'files': 1}).then(out => {
        res.json(out)
    }, err => {
        res.json(err);
    });
})

router.post('/getEmployeeSubscribefacilities', verifyToken, (req, res) => {
    userModel.find({_id: req.userId},{'facilities': 1}).then(out => {
        res.json(out)
    }, err => {
        res.json(err);
    });
})

router.post('/saveEmployeeVacation', verifyToken, (req, res) => {
    var employeeVacation = {
        vacationFrom: req.body.vacationFrom,
        vacationTo: req.body.vacationTo,
        vacacationType: req.body.vacationType,
        vacationReason: req.body.vacationReason,
        vacationStatus: 'Pending',
        remark:'',
        savedon: new Date(),
        savedby: currentuser
    }
    let vacationStatus = req.body.vacationStatus != undefined ? req.body.vacationStatus : 'Pending';
    if(vacationStatus === 'Pending') {
        userModel.find({_id: req.userId}, (error, document) => {
            if(!error) {
                document[0].Vacations.push(employeeVacation);
                document[0].save().then(ress => {
                res.send(document);
                }, err => {
                    console.log(err);
                })
            } else {
                res.send(error);
            }
        })
    } else {
        userModel.find({_id: req.body.userId}, (err, doc) => {
            if (!err ) {
                console.log('doc',doc)
                // if(doc[])
                // userModel.updateOne({_id: req.userId, 'files.documentname': req.body.documentname}, { $set: { 'files.$.fiName': fileName, 'files.$.savedon': new Date(), 'files.$.status': 'Submited' } }, (errr, docc) => {
                //     if(!errr) {
                //         res.send(docc);
                //     } else {
                //         console.log(errr);
                //         res.send(errr);
                //     }
                // })
            }
            else {
                console.log("error at employeedetails", err);
                res.send(errr);
            }
        })
    }
})

router.post('/employeedocumentsremark', verifyToken, (req, res) => {
        userModel.updateOne({_id: req.body.userId, 'files.documentname': req.body.documentname}, { $set: { 'files.$.status': req.body.documentstatus, 'files.$.remark': req.body.remark} }, (errr, docc) => {
            if(!errr) {
                res.send(docc);
            } else {
                res.send(errr);
            }
        });

})

router.post('/getallusers', verifyToken, (req, res) => {
        userModel.aggregate([
            { "$project":
                {   "fname": 1,
                    'email': 1,
                    'userrole': 1,
                    "lname": 1,
                    "_id": 1,
                    "empstatus": 1
                }
            },
            { "$match":
                {
                  "fname" : new RegExp('^'+req.body.fname, 'i')
                }
            }
        ]).then(doc => {
            if(doc.length != 0) {
                res.json(doc);
            } else {
                res.json([]);
            }
        }, err => {
            res.json(err);
        });
});


router.post('/updateemployeevacation', verifyToken, (req, res) => {
    userModel.updateOne({_id: req.body.userId, 'Vacations._id': mongoose.Types.ObjectId(req.body.docId)}, { $set: { 'Vacations.$.vacationStatus': req.body.vacationStatus, 'Vacations.$.remark': req.body.remark} }, (errr, docc) => {
        if(!errr) {
            res.send(docc);
        } else {
            res.send(errr);
        }
    });
});

router.post('/getalladmin', verifyToken, (req, res) => {
    var allAdminEmails = [];
    var employeeEmail;
    userModel.find({'userrole': 'Admin'}, {'email': 1}, (err, doc) => {
        if (!err ) {
            employeeEmail= req.body.email;
            if(doc.length != 0) {
                for(let emailIndex = 0; emailIndex < doc.length; emailIndex++) {
                    allAdminEmails[emailIndex] = doc[emailIndex].email;
                }
                let mailTransporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'balwellbeingllc@gmail.com',
                        pass: 'Balanced123'
                    }
                });
                var new_line = "\n\xA0";
                allAdminEmails.toString();
                let mailDetails = {
                    from: 'balwellbeingllc@gmail.com',
                    to: employeeEmail,
                    cc: allAdminEmails,
                    subject: 'Leave Application Status Change',
                    text: 'Dear '+req.body.name+' ,'+ new_line +'Your vacation application has been acted upon by approving authority. Please check the system for the status.'+new_line + new_line +'Regards,'+new_line+'System BWB'
                };
                mailTransporter.sendMail(mailDetails, function (err, data) {
                    if (err) {
                        logger.error("error occur while sending email"+mailDetails+allAdminEmails.toString()+employeeEmail.toString());
                        console.log('mailDetails', mailDetails)
                        res.send(['error occur while sending email'])
                    } else {
                        logger.info("Email Sent Successfully");
                        console.log('Email sent successfully');
                        res.send(['Email sent successfully']);
                    }
                });
            } else {
                res.send([]);
            }
        }
        else {
            console.log("error at employeedetails", err);
        }
    })
});



// get all document uploaded employee
router.post('/getemployeedocuments', verifyToken, (req, res) => {
    const fileName =  req.body.name !== undefined  ? 'search by name'  : 'search by status';
    if(fileName === 'search by name') {
        userModel.aggregate([
            { "$project":
                {   "fname": 1,
                    'email': 1,
                    'userrole': 1,
                    "lname": 1,
                    "files": 1,
                    "empstatus": 1,
                    "_id":1,
                    "facilities": 1,
                    "FILES_count": {
                        "$size": { "$ifNull": [ "$files", [] ] }
                    },
                    "FACILITIES_count": {
                        "$size": { "$ifNull": [ "$facilities", [] ] }
                    }
                }
            },
            { "$match":
                { "FILES_count": { "$gte": 0 },
                  "FACILITIES_count": { "$gte": 0 },
                  "fname" : new RegExp('^'+req.body.name, 'i')
                }
            }
        ]).then(doc => {
            if(doc.length != 0) {
                res.json(doc);
            } else {
                res.json("no");
            }
        }, err => {
            res.json(err);
        });
    } else {
        userModel.aggregate([
            {   "fname": 1,
                'email': 1,
                'userrole': 1,
                "lname": 1,
                "files": 1,
                "FILES_count": {
                    '$unwind':"$files"
                }
            },
            {"$match": {"FILES_count.status": req.body.documentstatus
                       }
            }
        ]).then(doc => {
            if (doc.length != 0) {
                res.json(doc);
            }
            else {
                res.json("no");
            }
        })
    }



});

router.post('/getvacationhistoryforallemployee', verifyToken, (req, res) => {
    userModel.aggregate([
        { "$project":
            {   "fname": 1,
                'email': 1,
                '_id': 1,
                'userrole': 1,
                "lname": 1,
                "Vacations": 1
            }
        },
        { "$unwind": {
            "path": "$Vacations",
            "preserveNullAndEmptyArrays": true
            }
        },
        {"$match": { $or: [
                    {
                    "Vacations.vacationFrom": {"$gte": new Date(req.body.vacationFrom), "$lte": new Date(req.body.vacationTo)
                                            }
                    },
                    {
                        "Vacations.vacationStatus": req.body.vacationStatus
                    },
                    {
                        "fname":req.body.name
                    }
                ]
            }
        }
    ]).then(doc => {
        if(doc.length != 0) {
            res.json(doc);
        } else {
            res.json([]);
        }
    }, err => {
        res.json(err);
    });
});

router.post('/updateemployeedetails', verifyToken, (req, res) => {
    userModel.updateOne({_id: req.body.userId}, { $set: { 'userrole': req.body.userRole, 'empstatus': req.body.userStatus} }, (errr, docc) => {
        if(!errr) {
            res.send(docc);
        } else {
            res.send(errr);
        }
    });
})

router.post('/getvacationhistory', verifyToken, (req, res) => {
    var toDateAddTime = new Date(req.body.vacationTo);
    toDateAddTime.setHours(toDateAddTime.getHours() + 24);
    if(req.body.vacationFrom !== undefined && req.body.vacationTo !== undefined) {
        userModel.aggregate([
            { "$project":
                {   "fname": 1,
                    'email': 1,
                    '_id': 1,
                    'userrole': 1,
                    "lname": 1,
                    "Vacations": 1
                }
            },
            { "$unwind": {
                "path": "$Vacations",
                "preserveNullAndEmptyArrays": true
                }
            },
            {"$match": {
                "Vacations.vacationFrom": {"$gte": new Date(req.body.vacationFrom), "$lte": toDateAddTime
                                        }
                , '_id': mongoose.Types.ObjectId(req.userId)
                }
            }
        ]).then(doc => {
            if(doc.length != 0) {
                res.json(doc);
            } else {
                res.json([]);
            }
        }, err => {
            res.json(err);
        });
    } else {
        userModel.aggregate([
            { "$project":
                {   "fname": 1,
                    'email': 1,
                    '_id': 1,
                    'userrole': 1,
                    "lname": 1,
                    "Vacations": 1
                }
            },
            { "$unwind": {
                "path": "$Vacations",
                "preserveNullAndEmptyArrays": true
                }
            },
            {"$match": {
                 '_id': mongoose.Types.ObjectId(req.userId)
                }
            }
        ]).then(doc => {
            if(doc.length != 0) {
                res.json(doc);
            } else {
                res.json([]);
            }
        }, err => {
            res.json(err);
        });
    }
});

router.post('/storeEmployeeFacility', verifyToken, (req, res) => {
    console.log('req.boduy', req.body)
    var empfacility = new employeeFacility({
    facilityname: req.body.facilityname,
    status: true,
    savedon: undefined,
    savedbby: currentuser,
    })
    empfacility.save().then(doc => { console.log("saved"); res.json('saved') }, err => {
        console.error("error");
        res.json('failure');
    })
});

//get all require docuemnt api
router.post('/getemployeedocumentslist', verifyToken, (req, res) => {

    // var requiredDocument = new requiredDocumentModel({
    // documentname: 'Cer. of HSC',
    // uploadbttonflag: false,
    // documentstatus: 'Not Submited',
    // filename: '',
    // documenttype: 'downloadanduploadfile',
    // documentlink: '',
    // templateform: 'file_1598613389214.docx',
    // showonui: true
    // })
    // requiredDocument.save().then(doc => { console.log("saved"); res.json('saved') }, err => {
    //     console.error("error");
    //     res.json('failure');
    // })

    requiredDocumentModel.find({showonui: {$ne: false}}).then(doc => {
        if (doc.length != 0) {
            res.json(doc);
        }
        else {
            res.json("no");
        }
    }, err => {
        res.json(err);
    });
});

router.post('/getEmployeeFacilities', verifyToken, (req, res) => {
    employeeFacility.find({status: {$ne: false}}).then(doc => {
        if (doc.length != 0) {
            res.json(doc);
        }
        else {
            res.json([]);
        }
    }, err => {
        res.json(err);
    });
});

router.post('/addFacilityToEmployee', verifyToken, (req, res) => {
    console.log('req', req.body)
    let empFacility ={
        facilityName: req.body.facilityName,
        subscribeStatus: req.body.subscribeStatus || true,
        facilityStartDate: undefined,
        facilityEndDate: undefined,
        facilityCharges: undefined,
        savedon: new Date(),
        savedby: currentuser,
        remark: undefined,
        submitbutton: true
      };
    userModel.find({_id: req.userId, "facilities.facilityName": req.body.facilityName}, (err, doc) => {
        console.log('doc-eror', err, doc);
        if (!err ) {
            if(doc.length == 0) {
                userModel.find({_id: req.userId}, (error, document) => {
                    if(!error) {
                        document[0].facilities.push(empFacility);
                        document[0].save().then(ress => {
                        res.send(document);
                        }, err => {
                            console.log(err);
                        })

                    } else {
                        res.send(error);
                    }

                })
            } else {
                userModel.updateOne({_id: req.userId, 'facilities.facilityName': req.body.facilityName}, { $set: { 'facilities.$.facilityStartDate': empFacility.facilityStartDate, 'facilities.$.facilityEndDate': empFacility.facilityEndDate, 'facilities.$.facilityCharges': empFacility.facilityCharges } }, (errr, docc) => {
                    if(!errr) {
                        res.send(docc);
                    } else {
                        console.log(errr);
                        res.send(errr);
                    }
                })
            }
        }
        else {
            console.log("error at employeedetails", err);
        }
    })
});

// fetchbyName ends

router.get('/call', verifyToken, (req, res) => {
    MasterPatientModel.find({},'-__v', (err, doc) => {
        if (!err) {
            console.log("Length " + doc.length);
            fi = callit(doc);
            setTimeout(() => {
                console.log("sending to frontend"+fi.length);
                const data = JSON.stringify(fi,null,4);
                // const data = fi;
                try {
                    fs.writeFileSync('fi.json', data);
                    console.log("JSON data is saved.");
                } catch (error) {
                    console.error(err);
                }
                res.json(fi);
            }, 1000)
        }
        else {
            console.log(err);
        }
    })
})
function callit(doc){
    console.log(doc.length);
for(let i=0;i<doc.length;i++){
    if(doc[i].visits.length > 1){
    let l = 0;
    console.log(doc[i].name + "Before "+doc[i].visits.length );
    let k = doc[i].visits.length-1;
    while(l < k){
        console.log("starting pos : " + l + " lasy point : " + k);
            if(l <= (k - 1)){
            if(doc[i].visits[l].visit == null || doc[i].visits[l+1].visit == null ||
                doc[i].visits[l].visit == undefined || doc[i].visits[l+1].visit == undefined ){
                console.log("saved on is not available at this position : " + l);
                l++;
            }
            else if(doc[i].visits[l].visit.getTime() == doc[i].visits[l+1].visit.getTime()){
                console.log("Date and time is duplicate for position no : " + l + " and position : " + (l+1));
                let o_id = new mongo.ObjectID(doc[i]._id);
                let o_idd = new mongo.ObjectID(doc[i].visits[l+1]._id);
                MasterPatientModel.update(
                    {"_id":o_id},
                    {$pull:
                        {"visits":
                            { "_id" : o_idd }
                        }
                    },
                    { safe: true, multi:true }
                    ).then(res=>{
                        console.log("working");
                    },err=>{
                        console.log(err);
                    })
                    doc[i].visits.splice((l+1),1);
                    console.log("this position got deleted : " + (l+1));
                k--;
                MasterPatientModel.update(
                    {"_id":o_id},
                    {$set:
                        {"__v":k}}
                    ).then(res=>{
                        // console.log("working" + res);
                    },err=>{
                        console.log(err);
                    })

            }
            else{
                l++;
            }
        }
        console.log("starting pos : " + l + " last point : " + k);
    }
}
// newdb(doc[i]);
}
return doc;
}
function newdb(data){
    let basedataa = new MasterPatientModell(data);
    if(basedataa.visits.length > 1){
    MasterPatientModel.update(
        {"name":basedataa.name},
        {$set:
            {"visits":[] , "__v":0}}
        ).then(res=>{
            // console.log("working" + res);
        },err=>{
            console.log(err);
        })

    for(let ii=0;ii<basedataa.visits.length;ii++){
        let masterdata = {
            savedon : basedataa.visits[ii].savedon,
            savedby : basedataa.visits[ii].savedby,
            visit: new Date(basedataa.visits[ii].visit),
            careconditiontimespent: basedataa.visits[ii].careconditiontimespent,
            seedoc: basedataa.visits[ii].seedoc,
            noseedocreason: basedataa.visits[ii].noseedocreason,
            othernoseedocreason: basedataa.visits[ii].othernoseedocreason,
            psynoseedocreason: basedataa.visits[ii].psynoseedocreason,
            otherpsynoseedocreason: basedataa.visits[ii].otherpsynoseedocreason,
            stable: basedataa.visits[ii].stable,
            gdrstable: basedataa.visits[ii].gdrstable,
            psythreapy: basedataa.visits[ii].psythreapy,
            reasonpsy: basedataa.visits[ii].reasonpsy,
            psyscreen: basedataa.visits[ii].psyscreen,
            psyscreenreason: basedataa.visits[ii].psyscreenreason,
            labs: basedataa.visits[ii].labs,
            labname: basedataa.visits[ii].labname,
            medmanage: basedataa.visits[ii].medmanage,
            reasonmedmanage: basedataa.visits[ii].reasonmedmanage,
            followup: basedataa.visits[ii].followup,
            patientcondition: basedataa.visits[ii].patientcondition,
            unstable_text: basedataa.visits[ii].unstable_text,
            started: basedataa.visits[ii].started,
            increase: basedataa.visits[ii].increase,
            decrease: basedataa.visits[ii].decrease,
            stopped: basedataa.visits[ii].stopped,
            decrease2: basedataa.visits[ii].decrease2,
            stopped2: basedataa.visits[ii].stopped2,
            medstopdate: basedataa.visits[ii].medstopdate,
            newappointmentrecord: basedataa.visits[ii].newappointmentrecord,
            added: basedataa.visits[ii].added,
            addeddate: basedataa.visits[ii].addeddate,
            yesstable: basedataa.visits[ii].yesstable,
            nostable: basedataa.visits[ii].nostable,
            verystable: basedataa.visits[ii].verystable,
            yesstablepsy: basedataa.visits[ii].yesstablepsy,
            nostablepsy: basedataa.visits[ii].nostablepsy,
            verystablepsy: basedataa.visits[ii].verystablepsy,
            psymanage: basedataa.visits[ii].psymanage,
            seepsy: basedataa.visits[ii].seepsy,
            noseepsyreason: basedataa.visits[ii].noseepsyreason,
            theligible: basedataa.visits[ii].theligible,
            pinsurance: basedataa.visits[ii].pinsurance,
            sinsurance: basedataa.visits[ii].sinsurance,
            facility: basedataa.visits[ii].facility,
            provider: basedataa.visits[ii].provider,
            room: basedataa.visits[ii].room,
            medication: basedataa.visits[ii].medication,
            medicationName: basedataa.visits[ii].medicationName,
            generictest: basedataa.visits[ii].generictest,
            pcp: basedataa.visits[ii].pcp,
            genericresult: basedataa.visits[ii].genericresult,
            docterupload: basedataa.visits[ii].docterupload,
            demographicsheetuploaded: basedataa.visits[ii].demographicsheetuploaded,
            capacityassesment: basedataa.visits[ii].capacityassesment,
            capacity: basedataa.visits[ii].capacity,
            bhi: basedataa.visits[ii].bhi,
            ccm: basedataa.visits[ii].ccm,
            bhiconcent: basedataa.visits[ii].bhiconcent,
            ccmconcent: basedataa.visits[ii].ccmconcent,
            medmanage2: basedataa.visits[ii].medmanage2,
            scaleeligible: basedataa.visits[ii].scaleeligible,
            scale: basedataa.visits[ii].scale,
            comment: basedataa.visits[ii].comment,
            service_type: basedataa.visits[ii].service_type,
            frequentlypsychotherapy: basedataa.visits[ii].frequentlypsychotherapy,
            typevisit: basedataa.visits[ii].typevisit,
            medreason: basedataa.visits[ii].medreason,
            othermedreason: basedataa.visits[ii].othermedreason,
            geneticreason: basedataa.visits[ii].geneticreason,
            othergeneticreason: basedataa.visits[ii].othergeneticreason,
            medreason2: basedataa.visits[ii].medreason2,
            othermedreason2: basedataa.visits[ii].othermedreason2,
            psyreason: basedataa.visits[ii].psyreason,
            otherpsyreason: basedataa.visits[ii].otherpsyreason,
            otherpsyscreenreason: basedataa.visits[ii].otherpsyscreenreason,
            bhireason: basedataa.visits[ii].bhireason,
            otherbhireason: basedataa.visits[ii].otherbhireason,
            ccmreason: basedataa.visits[ii].ccmreason,
            otherccmreason: basedataa.visits[ii].otherccmreason,
            homeclinic: basedataa.visits[ii].homeclinic,
            homeclinicconcent: basedataa.visits[ii].homeclinicconcent,
            homeclinicreason: basedataa.visits[ii].homeclinicreason,
            otherhomeclinicreason: basedataa.visits[ii].otherhomeclinicreason,
            masterstable: basedataa.visits[ii].masterstable,
            masterstablereason: basedataa.visits[ii].masterstablereason,
            typevisitreason: basedataa.visits[ii].typevisitreason,
            thtime: basedataa.visits[ii].thtime,
            consult: basedataa.visits[ii].consult,
            conpsy: basedataa.visits[ii].conpsy,
            conmed: basedataa.visits[ii].conmed,
            conscr: basedataa.visits[ii].conscr,
            conpsyreason: basedataa.visits[ii].conpsyreason,
            conmedreason: basedataa.visits[ii].conmedreason,
            conscrreason: basedataa.visits[ii].conscrreason,
            conpsyname: basedataa.visits[ii].conpsyname,
            currentmeds: basedataa.visits[ii].currentmeds,
            psy_symptoms: basedataa.visits[ii].psy_symptoms,
            meds_symptoms: basedataa.visits[ii].meds_symptoms,
            exmeds: basedataa.visits[ii].exmeds,
            scaleinfo: basedataa.visits[ii].scaleinfo,
            np: basedataa.visits[ii].np,
            cch: basedataa.visits[ii].cch,
            cchconcent: basedataa.visits[ii].cchconcent,
            cchdate: basedataa.visits[ii].cchdate,
            cchreason: basedataa.visits[ii].cchreason,
            othercchreason: basedataa.visits[ii].othercchreason,
            medfollowup: basedataa.visits[ii].medfollowup,
            followupreason: basedataa.visits[ii].followupreason,
            followupdays: basedataa.visits[ii].followupdays,
            scaleeligiblereason: basedataa.visits[ii].scaleeligiblereason,
            otherscaleeligiblereason: basedataa.visits[ii].otherscaleeligiblereason,
            scaledays: basedataa.visits[ii].scaledays,
            summary: basedataa.visits[ii].summary,
            nextvisitdate: basedataa.visits[ii].nextvisitdate
        }
        MasterPatientModel.findById(basedataa._id, (err, doc) => {
            doc.visits.push(masterdata);
            doc.save().then(res => {
            console.log("add");
            logger.info("Visit data saved for patient "+ basedataa.name);
            }, err => {
            logger.error("Error in saving visit data for patient");
            console.log(err);
            })
        })
    }
}
    console.log(basedataa.name + "after " + basedataa.visits.length);
}
module.exports = router;
