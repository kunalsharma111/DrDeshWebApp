const express = require('express');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
var nodemailer = require("nodemailer");
const router = express.Router();

require('../models/db');
const userModel = mongoose.model("User");
const patientModel = mongoose.model("Patient");
const R2Model = mongoose.model("R2P");
const FacilityModel = mongoose.model("Facility");
const InsuranceModel = mongoose.model("Insurance");
const MedicationModel = mongoose.model("Medication");
const ProviderModel = mongoose.model("Provider");
const MasterPatientModel = mongoose.model("MasterPatient");
const PostModel = mongoose.model("PostRoundUp");
const VModel = mongoose.model('VM');
var bcrypt = require('bcryptjs');

//register
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
                        res.send("failed");
                    } else {
                        console.log(doc);
                        let payload = { subject: doc._id };
                        let token = jwt.sign(payload, 'keysecret');
                        res.status(200).json(token);
                    }
                });
            } else {
                console.log("error in hashing the password");
            }
        });
    });
});
let sub;
function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    if (token === 'null') {
        return res.status(401).send('Unauthorized request')
    }
    // console.log("no error till here");
    let payload = jwt.verify(token, 'keysecret');
    // console.log(payload);
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }
    req.userId = payload.subject;
    sub = payload.subject;
    next()
}
//get current user
router.get('/red', verifyToken, (req, res) => {
    userModel.findOne({ _id: sub }, function (err, user) {
        if (!err) {
            res.json(user);
        }
        if (err) {
            console.log(err);
        }
    });
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
router.post('/facilityadd', verifyToken, (req, res) => {
    console.log(req.body + "vg");
    if (req.body.id == null) {
        let facility = new FacilityModel(req.body);
        facility.save(err => {
            if (!err) {
                res.json('saved to db');
            }
            else {
                console.log(err);
            }
        })
    } else {
        FacilityModel.findByIdAndUpdate(req.body.id, req.body, (err, doc) => {
            if (!err) {
                res.json('record updated')
            }
            else {
                res.json('some error');
            }
        })
    }
})
router.get('/getfacility', verifyToken, (req, res) => {
    FacilityModel.find({}, (err, doc) => {
        if (!err) {
            res.json(doc);
        }
        else {
            console.log('err to fetch details');
        }
    })
})
router.post('/insuranceadd', verifyToken, (req, res) => {
    console.log(req.body);
    if (req.body.id == null) {
        let insurance = new InsuranceModel(req.body);
        insurance.save(err => {
            if (!err) {
                res.json('saved to db');
            }
            else {
                console.log(err);
            }
        })
    } else {
        InsuranceModel.findByIdAndUpdate(req.body.id, req.body, (err, doc) => {
            if (!err) {
                res.json('record updated')
            }
            else {
                res.json('some error');
            }
        })
    }
})
router.get('/getinsurance', verifyToken, (req, res) => {
    InsuranceModel.find({}, (err, doc) => {
        if (!err) {
            res.json(doc);
        }
        else {
            console.log('err to fetch details');
        }
    })
})
router.post('/provideradd', verifyToken, (req, res) => {
    if (req.body.id == null) {
        console.log("here");
        console.log(req.body);
        let provider = new ProviderModel(req.body);
        provider.save(err => {
            if (!err) {
                res.json('saved to db');
            }
            else {
                console.log(err);
            }
        })
    } else {
        ProviderModel.findByIdAndUpdate(req.body.id, req.body, (err, doc) => {
            if (!err) {
                res.json('record updated')
            }
            else {
                res.json('some error');
            }
        })
    }
})
router.get('/getprovider', verifyToken, (req, res) => {
    ProviderModel.find({}, (err, doc) => {
        if (!err) {
            res.json(doc);
        }
        else {
            console.log('err to fetch details');
        }
    })
})
router.post('/medadd', verifyToken, (req, res) => {
    console.log(req.body);
    if (req.body.id == null) {
        let med = new MedicationModel(req.body);
        med.save(err => {
            if (!err) {
                res.json('saved to db');
            }
            else {
                console.log(err);
            }
        })
    } else {
        MedicationModel.findByIdAndUpdate(req.body.id, req.body, (err, doc) => {
            if (!err) {
                res.json('record updated')
            }
            else {
                res.json('some error');
            }
        })
    }
})
router.post('/goku', verifyToken, (req, res) => {
    var days = new Date();
    days.setDate(days.getDate() + 7);
    if (req.body.medfollowup != "Per routine protocol") {
        days = req.body.followupdays;
    }
    if(!req.body.visit) {
        req.body.visit = new Date()
    }
    let masterdata = {
        visit: req.body.visit,
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
        followupdays: days,
        scaleeligiblereason: req.body.scaleeligiblereason,
        otherscaleeligiblereason: req.body.otherscaleeligiblereason,
        scaledays: req.body.scaledays,
        summary: req.body.summary
    }
    MasterPatientModel.findById(req.body.id, (err, doc) => {
        if (!err) {
            doc.visits.push(masterdata);
            doc.save().then(res => {
                console.log("records saved")
            }, err => {
                console.log(err);
            })
        }
    })
});
router.get('/getmed', verifyToken, (req, res) => {
    MedicationModel.find({}, (err, doc) => {
        if (!err) {
            res.json(doc);
        }
        else {
            console.log('err to fetch details');
        }
    })
})
router.post("/confirmotp", (req, res) => {
    var user = req.body;
    console.log(user.oo + user.em);
    userModel.findOne({ email: user.em }, (err, doc) => {
        if (err) {
            console.log(err);
        }
        else {
            if (!doc) {
                res.status(401).send('Email not present');
            }
            else {
                if (doc.otp == user.oo) {
                    res.json("right OTP Change Passoword");
                }
                else {
                    res.status(401).send('Wrong OTP');
                }
            }
        }
    });
})

router.post("/changepassword", (req, res) => {
    var userr = req.body;
    userModel.findOne({ email: userr.em }, (err, doc) => {
        if (err) {
            console.log(err);
        }
        else {
            if (!doc) {
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
                                    res.json("password change successfully");
                                    // let payload = { subject: doc._id };
                                    // let token = jwt.sign(payload, 'keysecret');
                                    // res.status(200).json(token);
                                }
                                else {
                                    res.json("password change failed");
                                }
                            });
                        } else {
                            console.log("error in hashing the password");
                        }
                    });
                });
            }
        }
    });
})

router.post("/otp", (req, res) => {
    var user = req.body;
    var ott = Math.floor(100000 + Math.random() * 900000);
    var ee = user.email;
    userModel.findOne({ email: user.email }, (err, doc) => {
        if (err) {
            console.log(err);
        }
        else {
            if (!doc) {
                res.status(401).send('Email not registered')
            }
            else {
                const user = userModel.updateOne({ _id: doc._id }, { $set: { otp: ott } }, (err, doc) => {
                    if (!err) {
                        res.json({ e: ee });
                    }
                });
                console.log("akhir te");
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
                        console.log('Error Occurs');
                    } else {
                        console.log('Email sent successfully');
                    }
                });
            }
        }
    })
})
router.post("/login", (req, res) => {
    // console.log(req.body);
    var user = req.body;

    userModel.findOne({ email: user.email }, (err, doc) => {
        if (err) {
            console.log(err)
        } else {
            if (!doc) {
                res.status(401).send('Invalid Email')
            } else {
                bcrypt.compare(user.pwd, doc.pwd).then((result) => {
                    console.log(result);
                    if (!result) {
                        res.status(401).send('Invalid Password')
                    } else {
                        let payload = { subject: doc._id }
                        let token = jwt.sign(payload, 'keysecret')
                        res.status(200).send({ token })
                    }
                });
            }
        }
    })

});

router.post('/basedata', verifyToken, (req, res) => {
    // console.log(req.body);
    let data = req.body;
    let basedata = new MasterPatientModel(data);
    console.log(basedata)
    basedata.save().then(res => {
        console.log(res);
        res.json("saved to db")
    }, err => {
        console.log(err);
        res.json("errors in save")
    })
})

router.get('/get', verifyToken, (req, res) => {
    MasterPatientModel.findById(req.query.id).then(doc => {
        // console.log(doc.visits.length)
        // console.log(doc.visits[doc.visits.length-1])
        // console.log(doc.visits)
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




router.post('/preround', verifyToken, (req, res) => {

    ProviderModel.find({ name: req.body.provider }).then(doc => {
        return doc[0];
    })
        .catch(err => {
            console.log(err);
            res.json(err)
        })
        .then(result => {
            console.log(result);
            MasterPatientModel.find({}).then(step2 => {
                let preroundupdata = [];
                let mainDate = req.body.date;
                step2.forEach(pat => {
                    let x = pat.visits[pat.visits.length - 1]
                    if (x != undefined) {
                        let veryUrgent = false;
                        if (x.medfollowup == "Very Urgent") veryUrgent =
                            true;
                        if (result.insurance.includes(x.pinsurance) ||
                            result.insurance.includes(x.sinsurance) || veryUrgent) {
                            console.log(pat.name)
                            if (req.body.facility === x.facility) {
                                console.log(pat.name)
                                let visitdate = new Date(x.visit);
                                let selecteddate = new
                                    Date(req.body.date);
                                let psydate = new Date(x.visit);
                                let v_t = [];
                                let p_s = [];
                                let s_d = [];
                                let urgent = false;
                                if (x.medfollowup == 'urgent') {
                                    urgent = true;
                                }
                                let psyco = false;
                                if (x.followup) {
                                    psydate.setDate(psydate.getDate() +
                                        parseInt(x.followup));
                                    psyco = true;
                                }
                                let medmanage = false;
                                if (x.nostable == 'no' || x.medfollowup
                                    == "Date Specific") {
                                    medmanage = true;
                                    console.log(visitdate.getDate());
                                    if (x.followupdays != null ||
                                        x.followupdays != undefined) {
                                        visitdate = new
                                            Date(x.followupdays.valueOf());
                                    }
                                    else

                                        visitdate.setDate(visitdate.getDate() + 7);
                                }
                                else {

                                    visitdate.setDate(visitdate.getDate() + 30);
                                    medmanage = true;
                                }
                                let s_e = [];
                                if (x.medmanage == 'yes') {
                                    s_e.push('Med-Management')
                                }
                                if (x.psythreapy == 'yes') {
                                    s_e.push('Psycothreapy')
                                }
                                if (x.psyscreen == "yes") {
                                    s_e.push("Psychiatric screenings")
                                }
                                if (x.bhi == "yes") {
                                    s_e.push("bhi");
                                }
                                if (x.ccm == "yes") {
                                    s_e.push("ccm")
                                }
                                if (x.homeclinic == "yes") {
                                    s_e.push("virtual clinic")
                                }
                                let scale_dataa = false;
                                if (result.role.includes('Scale Performer')) {
                                    x.scaleinfo.forEach(scale => {
                                        console.log(scale)
                                        if (scale.scale_score == '') {
                                            console.log('insidestep1/2');

                                            p_s.push(scale.scale_name)
                                        }
                                        if (scale.scaledays != "" || scale.scaledays != "Not Applicable") {
                                            let scale_visit_date = new Date(scale.scale_date);
                                            console.log("scale visitdate" + scale_visit_date)
                                            if (scale_visit_date != "Invalid Date" || scale.scale_date != "") {
                                                console.log('insidestep2')
                                                if (scale.scaledays == "6 Months") {
                                                    console.log("6 mah")
                                                    var newdate = new Date(scale_visit_date.setMonth(scale_visit_date.getMonth() + 6));
                                                }
                                                if (scale.scaledays == "3 Months") {
                                                    console.log("3 mah")
                                                    var newdate = new Date(scale_visit_date.setMonth(scale_visit_date.getMonth() + 3));
                                                }

                                                console.log(scale_visit_date.toString())
                                                console.log("new date" +
                                                    newdate);
                                                if (+newdate <=
                                                    +selecteddate) {

                                                    console.log("inside");
                                                    scale_dataa = true;
                                                    s_d.push(scale);
                                                }
                                            }
                                        }
                                    })
                                }
                                console.log('pending scales', p_s);
                                if (scale_dataa || p_s.length) {
                                    v_t.push("Scales")
                                }
                                console.log(scale_dataa, v_t);
                                console.log(visitdate.toString(),
                                    selecteddate.toString(), psydate.toString())

                                console.log(result.role.includes('Medication management'))
                                let followup_reason = "-"
                                if (x.followupreason != undefined) {
                                    followup_reason = x.followupreason
                                }
                                if (+visitdate <= +selecteddate &&
                                    result.role.includes('Medication management') && medmanage || urgent ||
                                    veryUrgent) {
                                    if (+visitdate <= +selecteddate &&
                                        result.role.includes('Medication management')) {
                                        v_t.push("Med-Management")
                                    }

                                    if (urgent) {
                                        v_t.push("urgent");
                                    }
                                    if (veryUrgent) {
                                        v_t.push("very urgent");
                                    }

                                    let data_partial = {
                                        id: pat._id,
                                        name: pat.name,
                                        dob: pat.dob,
                                        room: x.room,
                                        insurance: x.pinsurance + " " +
                                            x.sinsurance,
                                        services_eligible: s_e,
                                        visit_type: v_t,
                                        followup_type: x.medfollowup,
                                        followup_reason: followup_reason,
                                        visit: mainDate,
                                        providerName: x.provider,
                                        facility: x.facility
                                    }
                                    console.log(data_partial);
                                    preroundupdata.push(data_partial);
                                }
                                if (+psydate <= +selecteddate &&
                                    result.role.includes('Psychotherapist') && psyco) {
                                    v_t.push("Psycothreapy");
                                    let data_partial = {
                                        id: pat._id,
                                        name: pat.name,
                                        dob: pat.dob,
                                        room: x.room,
                                        insurance: x.pinsurance + " " +
                                            x.sinsurance,
                                        services_eligible: s_e,
                                        visit_type: v_t,
                                        followup_type: x.medfollowup,
                                        followup_reason: followup_reason,
                                        visit: mainDate,
                                        providerName: x.provider,
                                        facility: x.facility
                                    }
                                    console.log(data_partial);
                                    preroundupdata.push(data_partial);
                                }
                                if (result.role.includes('Scale Performer')) {
                                    let data_partial = {
                                        id: pat._id,
                                        name: pat.name,
                                        dob: pat.dob,
                                        room: x.room,
                                        insurance: x.pinsurance + " " + x.sinsurance,
                                        services_eligible: s_e,
                                        pending_scales: p_s,
                                        scales_due: s_d,
                                        visit_type: v_t,
                                        followup_type: x.medfollowup,
                                        followup_reason: followup_reason,
                                        visit: mainDate,
                                        providerName: x.provider,
                                        facility: x.facility
                                    }
                                    console.log(data_partial);
                                    preroundupdata.push(data_partial);
                                }
                            }
                        }
                    }
                })
                preroundupdata.forEach(id => {
                    console.log('**************************************', id)
                    PostModel.find({ patientId: id.id, visitDate: { "$eq": new Date(id.visit) } }).then(res => {
                        console.log(res);
                        if (!res.length) {
                            let pd = new PostModel({
                                patientId: id.id,
                                visitDate: id.visit,
                                providerName: id.providerName,
                                facility: id.facility
                            })
                            console.log("------------")
                            console.log(pd)
                            console.log('------------');
                            pd.save().then(res => {
                                console.log(res);
                            })
                        }
                    })
                })
                res.json(preroundupdata)
            })
        })
})
router.post('/preroundfast', verifyToken, (req, res) => {
    // $add: [ "$CreatedDate", 2*24*60*60000 ] }
    MasterPatientModel.aggregate([{
        $project: {
            name: 1,
            visits: { $slice: ["$visits", -1] },
            v: "$visits.visit"
        }
    },
    {
        $addFields: {
            // convertedQty: {
            //     $convert: {
            //         input: "", to: "date",
            //         onError: "error",
            //         onNull: "off"
            //     }
            // },
            visitDate:
            {
                $cond: {
                    if: { $eq: ["$visits.nostable", ["no"]] },
                    then: { $add: [{ $arrayElemAt: ["$visits.visit", 0] }, 7 * 24 * 60 * 60000] },
                    else: { $add: [{ $arrayElemAt: ["$visits.visit", 0] }, 30 * 24 * 60 * 60000] }
                }
            },
        }
    },
    {
        $match: {
            "visits.facility": `${req.body.facility}`
            // visitDate: { $lte: new Date(req.body.date) }
        }
    }
    ])
        .then(result => {
            res.json(result)
        }).catch(err => {
            console.log(err);
        })
})
router.post('/providerperformancereport', verifyToken, (req, res) => {
    console.log(req.body.provider1);
    from = new Date(req.body.fromdate);
    to = new Date(req.body.todate);
    var proreport=[{
        facility_name:'',
        no_of_patients_seen : 0,
        points_seen : 0,
        meds_added : 0,
        meds_lowered : 0,
        meds_increased : 0,
        meds_added_with_stop_date : 0,
        meds_continued_but_added_stop_date : 0,
        meds_stopped : 0,
        scales_performed : 0,
        scales_details:[{scale_name:'',
        count:0,
        average_score:0}],
        number_of_each_subscale_performed : 0,
        average_score_of_each_scale : 0,
    }]

    MasterPatientModel.find({ 'visits.provider' : req.body.provider1,'visits.visit': {"$gte": new Date(req.body.fromdate),"$lte": new Date(req.body.todate)}})
    .then(doc => {
        if(doc.length  != 0 ){
           proreport = genreport(doc,proreport);
           setTimeout(() => {
                    res.json(proreport);
                }, 1000)
    }
    else{
        res.json("no");
    }
    })
})

// function genreportt(doc,proreport){
//     var total = doc.length-1;
//     firstvisit = false;
//     if(doc[0].visits.length == 1){
//         firstvisit = true;
//     }
//     var flag = 0;
//     while(total >= 0){
//         var totalvisits = doc[total].visits.length-1;
//         while(totalvisits >= 0){
//             if(doc[total].visits[totalvisits].visit >= from && doc[total].visits[totalvisits].visit <= to){
//                 var outputlength = proreport.length-1;
//                 var workon = 0;
//                 // For deciding on which position to workon 
//                 for(i=0;i<outputlength; i++){
//                     if(proreport[i].facility_name != doc[total].visits[totalvisits].facility 
//                         && i == finalsize && flag!=0){
//                         proreport.push({
//                             facility_name:'',
//                             no_of_patients_seen : 0,
//                             points_seen : 0,
//                             meds_added : 0,
//                             meds_lowered : 0,
//                             meds_increased : 0,
//                             meds_added_with_stop_date : 0,
//                             meds_continued_but_added_stop_date : 0,
//                             meds_stopped : 0,
//                             scales_performed : 0,
//                             scales_details:[{scale_name:'',
//                             count:0,
//                             average_score:0}],
//                             number_of_each_subscale_performed : 0,
//                             average_score_of_each_scale : 0,
//                         });
//                         console.log("Creating New Facility Line "+proreport.length +
//                          " Output Length after creating new Fac");
//                         workon = proreport.length-1;
//                         console.log("Now will workon this position of output " + workon);
//                         break;
//                     }
//                     else if(proreport[i].facility_name == doc[total].visits[totalvisits].facility){
//                         workon = i;
//                         console.log("found exisiting facility will addon details on same positon " + workon);
//                         break;
//                     }
//                     else if(finalsize == 0 && flag == 0){
//                         workon = i;
//                         console.log("visiting first time");
//                         flag = 1;
//                         break;
//                     }
//                 }


//                 // patients seen
//                 proreport[workon].no_of_patients_seen = proreport[workon].no_of_patients_seen + 1;


//                 // setting facility
//                 if(doc[total].visits[totalvisits].facility != undefined && 
//                 doc[total].visits[totalvisits].facility != null && doc[total].visits[totalvisits].facility != ""){
//                     proreport[workon].facility_name = doc[total].visits[totalvisits].facility;
//                 }

//                 // checking for new patient
//                 if(doc[total].visits[totalvisits].np == "yes" && doc[total].visits[totalvisits].np != undefined){
//                     proreport[workon].points_seen = proreport[workon].points_seen + 2;
//                 }

//             }
//             totalvisits--;
//         }
//     total--;
//     }
// }

function genreport(doc,proreport){
    var total = doc.length-1;
    // console.log(proreport.length);
    firstvisit = false;
    if(doc[0].visits.length == 1){
        firstvisit = true;
    }
    var flag = 0;
    while(total >= 0){
        var totalvisits = doc[total].visits.length-1;
        while(totalvisits >= 0){
            if(doc[total].visits[totalvisits].visit >= from && doc[total].visits[totalvisits].visit <= to){
                var finalsize = proreport.length-1;
                var workon = 0;
                for( i=0; i<=finalsize; i++){
                    if(proreport[i].facility_name != doc[total].visits[totalvisits].facility && i == finalsize && flag!=0){
                        proreport.push({
                            facility_name:'',
                            no_of_patients_seen : 0,
                            points_seen : 0,
                            meds_added : 0,
                            meds_lowered : 0,
                            meds_increased : 0,
                            meds_added_with_stop_date : 0,
                            meds_continued_but_added_stop_date : 0,
                            meds_stopped : 0,
                            scales_performed : 0,
                            scales_details:[{scale_name:'',
                            count:0,
                            average_score:0}],
                            number_of_each_subscale_performed : 0,
                            average_score_of_each_scale : 0,
                        });
                        console.log("new object bnata "+proreport.length + " after new object");
                        workon = proreport.length-1;
                        console.log(workon);
                        break;
                    }
                    else if(proreport[i].facility_name == doc[total].visits[totalvisits].facility){
                        workon = i;
                        console.log("found exisiting object for this facility at positon " + workon);
                        break;
                    }
                    else if(finalsize == 0 && flag == 0){
                        workon = i;
                        console.log("first time visit");
                        flag = 1;
                        break;
                    }
                }
                // patients seen
                proreport[workon].no_of_patients_seen = proreport[workon].no_of_patients_seen + 1;
                // setting facility
                if(doc[total].visits[totalvisits].facility != undefined && doc[total].visits[totalvisits].facility != null && doc[total].visits[totalvisits].facility != ""){
                    proreport[workon].facility_name = doc[total].visits[totalvisits].facility;
                }
                // checking for new patient
                if(doc[total].visits[totalvisits].np == "yes" && doc[total].visits[totalvisits].np != undefined){
                    proreport[workon].points_seen = proreport[workon].points_seen + 2;
                }
                // checking for medication management follow up
                if(doc[total].visits[totalvisits].typevisit ==  "Med-management follow up" && doc[total].visits[totalvisits].typevisit != undefined){
                    proreport[workon].points_seen = proreport[workon].points_seen + 1;
                }
                // checking for atleast two
                // console.log(doc[total].visits[totalvisits].scaleinfo.length + "visit no" + totalvisits);
                var scale_size = doc[total].visits[totalvisits].scaleinfo.length-1;
                if(doc[total].visits[totalvisits].scaleinfo.length >=2 && doc[total].visits[totalvisits].scaleinfo != undefined){
                    proreport[workon].points_seen = proreport[workon].points_seen + 1.5;
                    flag = true;
                    // adding 2.5 score if scales have Dementia testing scale
                    while(scale_size >= 0 && flag == true){
                        if(doc[total].visits[totalvisits].scaleinfo[scale_size].scale_name == "MOCA"){
                            proreport[workon].points_seen = proreport[workon].points_seen + 2.5;
                            flag = false;
                        }
                        scale_size--;
                    }
                }
                // Psychotherapy points
                if(doc[total].visits[totalvisits].thtime == "Upto 30 min"){
                    proreport[workon].points_seen = proreport[workon].points_seen + 1;
                }
                if(doc[total].visits[totalvisits].thtime == "Upto 45 min"){
                    proreport[workon].points_seen = proreport[workon].points_seen + 1.5;
                }
                if(doc[total].visits[totalvisits].thtime == "Upto 1 Hr"){
                    proreport[workon].points_seen = proreport[workon].points_seen + 2;
                }
                if(doc[total].visits[totalvisits].thtime == "More then 1 Hr"){
                    proreport[workon].points_seen = proreport[workon].points_seen + 2.5;
                }
                // medicine continued but addded stop date
                if(firstvisit == true && doc[total].visits[totalvisits].medstopdate != undefined){
                    if(doc[total].visits[totalvisits].medstopdate != null  ){
                        proreport[workon].meds_continued_but_added_stop_date = proreport[workon].meds_continued_but_added_stop_date + 1;
                    }
                }
                else if(totalvisits - 1 >= 0 && doc[total].visits[totalvisits].medstopdate != undefined){
                    if(doc[total].visits[totalvisits].medstopdate != doc[total].visits[totalvisits-1].medstopdate && doc[total].visits[totalvisits].medstopdate != ""){
                        proreport[workon].meds_continued_but_added_stop_date = proreport[workon].meds_continued_but_added_stop_date + 1;
                    }
                }
                else if(doc[total].visits[totalvisits].medstopdate != undefined){
                    if(doc[total].visits[totalvisits].medstopdate != doc[total].visits[totalvisits+1].medstopdate && doc[total].visits[totalvisits].medstopdate != ""){
                        proreport[workon].meds_continued_but_added_stop_date = proreport[workon].meds_continued_but_added_stop_date + 1;
                    }
                }
                // stop date of added medicine
                if(firstvisit == true && doc[total].visits[totalvisits].addeddate != undefined){
                    if(doc[total].visits[totalvisits].addeddate != null  ){
                        proreport[workon].meds_added_with_stop_date = proreport[workon].meds_added_with_stop_date + 1;
                    }
                }
                else if(totalvisits - 1 >= 0 && doc[total].visits[totalvisits].addeddate != undefined){
                    if(doc[total].visits[totalvisits].addeddate != doc[total].visits[totalvisits-1].addeddate && doc[total].visits[totalvisits].addeddate != ""){
                        proreport[workon].meds_added_with_stop_date = proreport[workon].meds_added_with_stop_date + 1;
                    }
                }
                else if(doc[total].visits[totalvisits].addeddate != undefined){
                    if(doc[total].visits[totalvisits].addeddate != doc[total].visits[totalvisits+1].addeddate && doc[total].visits[totalvisits].addeddate != ""){
                        proreport[workon].meds_added_with_stop_date = proreport[workon].meds_added_with_stop_date + 1;
                    }
                }
                // Added Medicine
                if(firstvisit == true && doc[total].visits[totalvisits].added != undefined){
                    if(doc[total].visits[totalvisits].added != null || doc[total].visits[totalvisits].added != undefined ){
                        proreport[workon].meds_added = proreport[workon].meds_added + 1;
                    }
                }
                else if(totalvisits - 1 >= 0 && doc[total].visits[totalvisits].added != undefined){
                    if(doc[total].visits[totalvisits].added != doc[total].visits[totalvisits-1].added && doc[total].visits[totalvisits].added != ""){
                        proreport[workon].meds_added = proreport[workon].meds_added + 1;
                    }
                }
                else if(doc[total].visits[totalvisits].added != undefined){
                    if(doc[total].visits[totalvisits].added != doc[total].visits[totalvisits+1].added && doc[total].visits[totalvisits].added != ""){
                        proreport[workon].meds_added = proreport[workon].meds_added + 1;
                    }
                }
                // Increased Medicine
                if(doc[total].visits[totalvisits].increase != undefined){
                if(firstvisit == true){
                    if(doc[total].visits[totalvisits].increase != null || doc[total].visits[totalvisits].increase != undefined ){
                        proreport[workon].meds_increased = proreport[workon].meds_increased + 1;
                    }
                }
                else if(totalvisits - 1 >= 0 && doc[total].visits[totalvisits].increase != undefined){
                    if(doc[total].visits[totalvisits].increase != doc[total].visits[totalvisits-1].increase && doc[total].visits[totalvisits].increase != ""){
                        proreport[workon].meds_increased = proreport[workon].meds_increased + 1;
                    }
                }
                else if(doc[total].visits[totalvisits].increase != undefined){
                    if(doc[total].visits[totalvisits].increase != doc[total].visits[totalvisits+1].increase && doc[total].visits[totalvisits].increase != ""){
                        proreport[workon].meds_increased = proreport[workon].meds_increased + 1;
                    }
                }
            }
                // Stopped Medicine
                if(firstvisit == true && doc[total].visits[totalvisits].stopped2 != undefined){
                    if(doc[total].visits[totalvisits].stopped2 != null || doc[total].visits[totalvisits].stopped2 != undefined ){
                        proreport[workon].meds_stopped = proreport[workon].meds_stopped + 1;
                    }
                }
                else if(totalvisits - 1 >= 0 && doc[total].visits[totalvisits].stopped2 != undefined){
                    if(doc[total].visits[totalvisits].stopped2 != doc[total].visits[totalvisits-1].stopped2 && doc[total].visits[totalvisits].stopped2 != ""){
                        proreport[workon].meds_stopped = proreport[workon].meds_stopped + 1;
                    }
                }
                else if(doc[total].visits[totalvisits].stopped2 != undefined){
                    if(doc[total].visits[totalvisits].stopped2 != doc[total].visits[totalvisits+1].stopped2 && doc[total].visits[totalvisits].stopped2 != ""){
                        proreport[workon].meds_stopped = proreport[workon].meds_stopped + 1;
                    }
                }
                // meds lowered or decreased
                if(firstvisit == true && doc[total].visits[totalvisits].decrease2 != undefined){
                    if(doc[total].visits[totalvisits].decrease2 != null || doc[total].visits[totalvisits].decrease2 != undefined ){
                        proreport[workon].meds_lowered = proreport[workon].meds_lowered + 1;
                    }
                }
                else if(totalvisits - 1 >= 0 && doc[total].visits[totalvisits].decrease2 != undefined){
                    if(doc[total].visits[totalvisits].decrease2 != doc[total].visits[totalvisits-1].decrease2 && doc[total].visits[totalvisits].decrease2 != ""){
                        proreport[workon].meds_lowered = proreport[workon].meds_lowered + 1;
                    }
                }
                else if(doc[total].visits[totalvisits].decrease2 != undefined){
                    if(doc[total].visits[totalvisits].decrease2 != doc[total].visits[totalvisits+1].decrease2 && doc[total].visits[totalvisits].decrease2 != ""){
                        proreport[workon].meds_lowered = proreport[workon].meds_lowered + 1;
                    }
                }
                // scales performed
                if(firstvisit == true && doc[total].visits[totalvisits].scaleinfo.length != 0){
                    if(doc[total].visits[totalvisits].scaleinfo.length != null || doc[total].visits[totalvisits].scaleinfo.length != undefined ){
                        proreport[workon].scales_performed = proreport[workon].scales_performed + doc[total].visits[totalvisits].scaleinfo.length;
                    }
                }
                else if(totalvisits - 1 >= 0 && doc[total].visits[totalvisits].scaleinfo.length != 0){
                    if(doc[total].visits[totalvisits].scaleinfo.length != doc[total].visits[totalvisits-1].scaleinfo.length){
                        if(doc[total].visits[totalvisits].scaleinfo.length > doc[total].visits[totalvisits-1].scaleinfo.length){
                            add = doc[total].visits[totalvisits].scaleinfo.length - doc[total].visits[totalvisits-1].scaleinfo.length;
                        }
                        else{
                            add = 0;
                        }
                        proreport[workon].scales_performed = proreport[workon].scales_performed + add;
                    }
                }
                else if(doc[total].visits[totalvisits].scaleinfo.length != 0){
                   
                    if(doc[total].visits[totalvisits].scaleinfo.length != doc[total].visits[totalvisits+1].scaleinfo.length){
                        
                        if(doc[total].visits[totalvisits].scaleinfo.length > doc[total].visits[totalvisits-1].scaleinfo.length){
                            add = doc[total].visits[totalvisits].scaleinfo.length - doc[total].visits[totalvisits-1].scaleinfo.length;
                        }
                        else{
                            add = 0;
                        }
                        proreport[workon].scales_performed = proreport[workon].scales_performed + add;
                    }
                }
                var scale_length = doc[total].visits[totalvisits].scaleinfo.length;
                console.log("scales")
                var ff = 0;
                for(k=0;k<scale_length;k++){
                    console.log(doc[total].visits[totalvisits].scaleinfo[k].scale_name);
                    console.log(proreport[workon].scales_details.length-1);
                    console.log("error kidr hai ? 1");
                    for( p=0; p<=proreport[workon].scales_details.length-1; p++){
                        console.log("error kidr hai ? 2 " + k + " " + p);
                        if(proreport[workon].scales_details.length == 1 && ff==0){
                            console.log("error kidr hai ? 3");
                            console.log("first scale to be added in record");
                            proreport[workon].scales_details[p].scale_name = doc[total].visits[totalvisits].scaleinfo[k].scale_name;
                            proreport[workon].scales_details[p].count = proreport[workon].scales_details[p].count + 1; 
                            ff = 1;
                            break;
                        }
                        else if(proreport[workon].scales_details[p].scale_name == doc[total].visits[totalvisits].scaleinfo[k].scale_name){
                            console.log("error kidr hai ? 4");
                            if(totalvisits > 0){
                                var isPresent = doc[total].visits[totalvisits-1].scaleinfo.some((el)=>{ 
                                    if(el.scale_name === proreport[workon].scales_details[p].scale_name){
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });
                                if(isPresent == false){
                                    console.log("error kidr hai ? 5");
                                    console.log("pata nh");
                                    proreport[workon].scales_details[p].count = proreport[workon].scales_details[p].count + 1;
                                }
                            }
                            console.log("same record");
                            break;
                        }
                        else if(proreport[workon].scales_details[p].scale_name != doc[total].visits[totalvisits].scaleinfo[k].scale_name && p == proreport[workon].scales_details.length-1){
                            console.log("new record for scale");
                            console.log("error kidr hai ? 6");
                                 console.log(proreport[workon].scales_details.length-1);
                                 proreport[workon].scales_details.push({
                                        scale_name : doc[total].visits[totalvisits].scaleinfo[k].scale_name,
                                        count : 1,
                                        average_score : 0
                                 })
                             break;
                        }
                    }
                }
            }
            totalvisits--;
        }
        console.log(proreport[workon].scales_details);
        total--;
    }
        // console.log(proreport);
        return proreport;
}

router.post('/facilityreport', verifyToken, (req, res) => {
    from = new Date(req.body.fromdate1);
    to = new Date(req.body.todate1);
    var proreport=[{
        provider_name:'',
        no_of_patients_seen : 0,
        points_seen : 0,
        meds_added : 0,
        meds_lowered : 0,
        meds_increased : 0,
        meds_added_with_stop_date : 0,
        meds_continued_but_added_stop_date : 0,
        meds_stopped : 0,
        scales_performed : 0,
        scales_details:[{scale_name:'',
                            count:0,
                            average_score:0}],
        number_of_each_subscale_performed : 0,
        average_score_of_each_scale : 0,
    }]
    MasterPatientModel.find({ 'visits.facility' : req.body.facility1,'visits.visit': {"$gte": new Date(req.body.fromdate1),"$lte": new Date(req.body.todate1)}})
    .then(doc => {
        if(doc.length  != 0 ){
           proreport = genreport2(doc,proreport);
           setTimeout(() => {
               console.log(proreport);
                    res.json(proreport);
                }, 1000)
    }
    else{
        res.json("no");
    }
    })
})
function genreport2(doc,proreport){
    var total = doc.length-1;
    // console.log(proreport.length);
    firstvisit = false;
    if(doc[0].visits.length == 1){
        firstvisit = true;
    }
    var flag = 0;
    while(total >= 0){
        var totalvisits = doc[total].visits.length-1;
        while(totalvisits >= 0){
            if(doc[total].visits[totalvisits].visit >= from && doc[total].visits[totalvisits].visit <= to){
                var finalsize = proreport.length-1;
                var workon = 0;
                for( i=0; i<=finalsize; i++){
                    if(proreport[i].provider_name != doc[total].visits[totalvisits].provider && i == finalsize && flag!=0){
                        proreport.push({
                            provider_name:'',
                            no_of_patients_seen : 0,
                            points_seen : 0,
                            meds_added : 0,
                            meds_lowered : 0,
                            meds_increased : 0,
                            meds_added_with_stop_date : 0,
                            meds_continued_but_added_stop_date : 0,
                            meds_stopped : 0,
                            scales_performed : 0,
                            scales_details:[{scale_name:'',
                            count:0,
                            average_score:0}],
                            number_of_each_subscale_performed : 0,
                            average_score_of_each_scale : 0,
                        });
                        console.log("new object bnata "+proreport.length + " after new object");
                        workon = proreport.length-1;
                        console.log(workon);
                        break;
                    }
                    else if(proreport[i].provider_name == doc[total].visits[totalvisits].provider){
                        workon = i;
                        console.log("found exisiting object for this provider at positon " + workon);
                        break;
                    }
                    else if(finalsize == 0 && flag == 0){
                        workon = i;
                        console.log("first time visit");
                        flag = 1;
                        break;
                    }
                }
                // patients seen
                proreport[workon].no_of_patients_seen = proreport[workon].no_of_patients_seen + 1;
                // setting provider
                if(doc[total].visits[totalvisits].provider != undefined && doc[total].visits[totalvisits].provider != null && doc[total].visits[totalvisits].provider != ""){
                    proreport[workon].provider_name = doc[total].visits[totalvisits].provider;
                }
                // checking for new patient
                if(doc[total].visits[totalvisits].np == "yes" && doc[total].visits[totalvisits].np != undefined){
                    proreport[workon].points_seen = proreport[workon].points_seen + 2;
                }
                // checking for medication management follow up
                if(doc[total].visits[totalvisits].typevisit ==  "Med-management follow up" && doc[total].visits[totalvisits].typevisit != undefined){
                    proreport[workon].points_seen = proreport[workon].points_seen + 1;
                }
                // checking for atleast two
                // console.log(doc[total].visits[totalvisits].scaleinfo.length + "visit no" + totalvisits);
                var scale_size = doc[total].visits[totalvisits].scaleinfo.length-1;
                if(doc[total].visits[totalvisits].scaleinfo.length >=2 && doc[total].visits[totalvisits].scaleinfo != undefined){
                   
                    proreport[workon].points_seen = proreport[workon].points_seen + 1.5;
                    flag = true;
                    // adding 2.5 score if scales have Dementia testing scale 
                    while(scale_size >= 0 && flag == true){
                        if(doc[total].visits[totalvisits].scaleinfo[scale_size].scale_name == "MOCA"){
                            proreport[workon].points_seen = proreport[workon].points_seen + 2.5;
                            flag = false;
                        }
                        scale_size--;
                    }
                }
                // Psychotherapy points
                if(doc[total].visits[totalvisits].thtime == "Upto 30 min"){
                    proreport[workon].points_seen = proreport[workon].points_seen + 1;
                }
                if(doc[total].visits[totalvisits].thtime == "Upto 45 min"){
                    proreport[workon].points_seen = proreport[workon].points_seen + 1.5;
                }
                if(doc[total].visits[totalvisits].thtime == "Upto 1 Hr"){
                    proreport[workon].points_seen = proreport[workon].points_seen + 2;
                }
                if(doc[total].visits[totalvisits].thtime == "More then 1 Hr"){
                    proreport[workon].points_seen = proreport[workon].points_seen + 2.5;
                }
                // medicine continued but addded stop date
                if(firstvisit == true && doc[total].visits[totalvisits].medstopdate != undefined){
                    if(doc[total].visits[totalvisits].medstopdate != null  ){
                        proreport[workon].meds_continued_but_added_stop_date = proreport[workon].meds_continued_but_added_stop_date + 1;
                    }
                }
                else if(totalvisits - 1 >= 0 && doc[total].visits[totalvisits].medstopdate != undefined){
                    if(doc[total].visits[totalvisits].medstopdate != doc[total].visits[totalvisits-1].medstopdate && doc[total].visits[totalvisits].medstopdate != ""){
                        proreport[workon].meds_continued_but_added_stop_date = proreport[workon].meds_continued_but_added_stop_date + 1;
                    }
                }
                else if(doc[total].visits[totalvisits].medstopdate != undefined){
                    if(doc[total].visits[totalvisits].medstopdate != doc[total].visits[totalvisits+1].medstopdate && doc[total].visits[totalvisits].medstopdate != ""){
                        proreport[workon].meds_continued_but_added_stop_date = proreport[workon].meds_continued_but_added_stop_date + 1;
                    }
                }
                // stop date of added medicine
                if(firstvisit == true && doc[total].visits[totalvisits].addeddate != undefined){
                    if(doc[total].visits[totalvisits].addeddate != null  ){
                        proreport[workon].meds_added_with_stop_date = proreport[workon].meds_added_with_stop_date + 1;
                    }
                }
                else if(totalvisits - 1 >= 0 && doc[total].visits[totalvisits].addeddate != undefined){
                    if(doc[total].visits[totalvisits].addeddate != doc[total].visits[totalvisits-1].addeddate && doc[total].visits[totalvisits].addeddate != ""){
                        proreport[workon].meds_added_with_stop_date = proreport[workon].meds_added_with_stop_date + 1;
                    }
                }
                else if(doc[total].visits[totalvisits].addeddate != undefined){
                    if(doc[total].visits[totalvisits].addeddate != doc[total].visits[totalvisits+1].addeddate && doc[total].visits[totalvisits].addeddate != ""){
                        proreport[workon].meds_added_with_stop_date = proreport[workon].meds_added_with_stop_date + 1;
                    }
                }
                // Added Medicine 
                if(firstvisit == true && doc[total].visits[totalvisits].added != undefined){
                    if(doc[total].visits[totalvisits].added != null || doc[total].visits[totalvisits].added != undefined ){
                        proreport[workon].meds_added = proreport[workon].meds_added + 1;
                    }
                }
                else if(totalvisits - 1 >= 0 && doc[total].visits[totalvisits].added != undefined){
                    if(doc[total].visits[totalvisits].added != doc[total].visits[totalvisits-1].added && doc[total].visits[totalvisits].added != ""){
                        proreport[workon].meds_added = proreport[workon].meds_added + 1;
                    }
                }
                else if(doc[total].visits[totalvisits].added != undefined){
                    if(doc[total].visits[totalvisits].added != doc[total].visits[totalvisits+1].added && doc[total].visits[totalvisits].added != ""){
                        proreport[workon].meds_added = proreport[workon].meds_added + 1;
                    }
                }
                // Increased Medicine
                if(firstvisit == true && doc[total].visits[totalvisits].increase != undefined){
                    if(doc[total].visits[totalvisits].increase != null || doc[total].visits[totalvisits].increase != undefined ){
                        proreport[workon].meds_increased = proreport[workon].meds_increased + 1;
                    }
                }
                else if(totalvisits - 1 >= 0 && doc[total].visits[totalvisits].increase != undefined){
                    if(doc[total].visits[totalvisits].increase != doc[total].visits[totalvisits-1].increase && doc[total].visits[totalvisits].increase != ""){
                        proreport[workon].meds_increased = proreport[workon].meds_increased + 1;
                    }
                }
                else if(doc[total].visits[totalvisits].increase != undefined){
                    if(doc[total].visits[totalvisits].increase != doc[total].visits[totalvisits+1].increase && doc[total].visits[totalvisits].increase != ""){
                        proreport[workon].meds_increased = proreport[workon].meds_increased + 1;
                    }
                }
                // Stopped Medicine
                if(firstvisit == true && doc[total].visits[totalvisits].stopped2 != undefined){
                    if(doc[total].visits[totalvisits].stopped2 != null || doc[total].visits[totalvisits].stopped2 != undefined ){
                        proreport[workon].meds_stopped = proreport[workon].meds_stopped + 1;
                    }
                }
                else if(totalvisits - 1 >= 0 && doc[total].visits[totalvisits].stopped2 != undefined){
                    if(doc[total].visits[totalvisits].stopped2 != doc[total].visits[totalvisits-1].stopped2 && doc[total].visits[totalvisits].stopped2 != ""){
                        proreport[workon].meds_stopped = proreport[workon].meds_stopped + 1;
                    }
                }
                else if(doc[total].visits[totalvisits].stopped2 != undefined){
                    if(doc[total].visits[totalvisits].stopped2 != doc[total].visits[totalvisits+1].stopped2 && doc[total].visits[totalvisits].stopped2 != ""){
                        proreport[workon].meds_stopped = proreport[workon].meds_stopped + 1;
                    }
                }
                // meds lowered or decreased
                if(firstvisit == true && doc[total].visits[totalvisits].decrease2 != undefined){
                    if(doc[total].visits[totalvisits].decrease2 != null || doc[total].visits[totalvisits].decrease2 != undefined ){
                        proreport[workon].meds_lowered = proreport[workon].meds_lowered + 1;
                    }
                }
                else if(totalvisits - 1 >= 0 && doc[total].visits[totalvisits].decrease2 != undefined){
                    if(doc[total].visits[totalvisits].decrease2 != doc[total].visits[totalvisits-1].decrease2 && doc[total].visits[totalvisits].decrease2 != ""){
                        proreport[workon].meds_lowered = proreport[workon].meds_lowered + 1;
                    }
                }
                else if(doc[total].visits[totalvisits].decrease2 != undefined){
                    if(doc[total].visits[totalvisits].decrease2 != doc[total].visits[totalvisits+1].decrease2 && doc[total].visits[totalvisits].decrease2 != ""){
                        proreport[workon].meds_lowered = proreport[workon].meds_lowered + 1;
                    }
                }
                // scales performed
                if(firstvisit == true && doc[total].visits[totalvisits].scaleinfo.length != 0){
                    if(doc[total].visits[totalvisits].scaleinfo.length != null || doc[total].visits[totalvisits].scaleinfo.length != undefined ){
                        proreport[workon].scales_performed = proreport[workon].scales_performed + doc[total].visits[totalvisits].scaleinfo.length;
                    }
                }
                else if(totalvisits - 1 >= 0 && doc[total].visits[totalvisits].scaleinfo.length != 0){
                    if(doc[total].visits[totalvisits].scaleinfo.length != doc[total].visits[totalvisits-1].scaleinfo.length){
                        if(doc[total].visits[totalvisits].scaleinfo.length > doc[total].visits[totalvisits-1].scaleinfo.length){
                            add = doc[total].visits[totalvisits].scaleinfo.length - doc[total].visits[totalvisits-1].scaleinfo.length;
                        }
                        else{
                            add = 0;
                        }
                        proreport[workon].scales_performed = proreport[workon].scales_performed + add;
                    }
                }
                else if(doc[total].visits[totalvisits].scaleinfo.length != 0){
                    if(doc[total].visits[totalvisits].scaleinfo.length != doc[total].visits[totalvisits+1].scaleinfo.length 
                        && totalvisits > 0){
                        if(doc[total].visits[totalvisits].scaleinfo.length > doc[total].visits[totalvisits-1].scaleinfo.length){
                            add = doc[total].visits[totalvisits].scaleinfo.length - doc[total].visits[totalvisits-1].scaleinfo.length;
                        }
                        else{
                            add = 0;
                        }
                        proreport[workon].scales_performed = proreport[workon].scales_performed + add;
                    }
                }
                console.log("jai mata 2");
                var scale_length = doc[total].visits[totalvisits].scaleinfo.length;
                console.log("scales");
                var ff = 0;
                for(k=0;k<scale_length;k++){
                    console.log(doc[total].visits[totalvisits].scaleinfo[k].scale_name);
                    console.log(proreport[workon].scales_details.length-1);
                    console.log("error kidr hai ? 1");
                    for( p=0; p<=proreport[workon].scales_details.length-1; p++){
                        console.log("error kidr hai ? 2 " + k + " " + p);
                        if(proreport[workon].scales_details.length == 1 && ff==0){
                            console.log("error kidr hai ? 3");
                            console.log("first scale to be added in record");
                            proreport[workon].scales_details[p].scale_name = doc[total].visits[totalvisits].scaleinfo[k].scale_name;
                            proreport[workon].scales_details[p].count = proreport[workon].scales_details[p].count + 1; 
                            ff = 1;
                            break;
                        }
                        else if(proreport[workon].scales_details[p].scale_name == doc[total].visits[totalvisits].scaleinfo[k].scale_name){
                            console.log("error kidr hai ? 4");
                            if(totalvisits > 0){
                                var isPresent = doc[total].visits[totalvisits-1].scaleinfo.some((el)=>{ 
                                    if(el.scale_name === proreport[workon].scales_details[p].scale_name){
                                        return true;
                                    }else{
                                        return false;
                                    }
                                });
                                if(isPresent == false){
                                    console.log("error kidr hai ? 5");
                                    console.log("pata nh");
                                    proreport[workon].scales_details[p].count = proreport[workon].scales_details[p].count + 1;
                                }
                            }
                            console.log("same record");
                            break;
                        }
                        else if(proreport[workon].scales_details[p].scale_name != doc[total].visits[totalvisits].scaleinfo[k].scale_name && p == proreport[workon].scales_details.length-1){
                            console.log("new record for scale");
                                 console.log(proreport[workon].scales_details.length-1);
                                 proreport[workon].scales_details.push({
                                        scale_name : doc[total].visits[totalvisits].scaleinfo[k].scale_name,
                                        count : 1,
                                        average_score : 0
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
    console.log(proreport);
    return proreport;
}

router.post('/postreport', verifyToken, (req, res) => {
    console.log(req.body)
    let nextDate = new Date(req.body.date);
    nextDate.setDate(nextDate.getDate()+1);
    MasterPatientModel.find(
        {
            "visits.visit": { $gte: new Date(req.body.date), "$lt": new Date(nextDate) } 
        }
    ).then(ma=>{
        console.log(ma);
    })
    MasterPatientModel.find(
        {
            "visits.provider": req.body.provider,
            "visits.facility": req.body.facility,
            "visits.visit": { $gte: new Date(req.body.date), "$lt": new Date(nextDate) } 
        },{name:1,visits:{$slice:-1}}
    ).then(log => {
        res.json(log);
    }).catch(err => {
        res.json(err)
    })
})
router.post('/medreport', verifyToken, (req, res) => {
    console.log(req.body)
    let nextDate = new Date(req.body.date);
    nextDate.setDate(nextDate.getDate()+1);
    MasterPatientModel.find(
        {
            "visits.visit": { $gte: new Date(req.body.date), "$lt": new Date(nextDate) } 
        }
    ).then(ma=>{
        console.log(ma);
    })
    MasterPatientModel.find(
        {
            "visits.provider": req.body.provider,
            "visits.facility": req.body.facility,
            "visits.nostable": "no",
            "visits.visit": { $gte: new Date(req.body.date), "$lt": new Date(nextDate) } 
        }
    ).then(log => {
        res.json(log);
    }).catch(err => {
        res.json(err)
    })
})
router.get('/fetchByName',verifyToken,(req,res)=>{
    let name = new RegExp(req.query.name);
    MasterPatientModel.find({"name": new RegExp(name,'i')}).then(out=>{
        // console.log(out);
        res.json(out)
    })
})
module.exports = router;