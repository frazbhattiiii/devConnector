const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
// Loading Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");


// Models loading
const Profile = require("../../models/Profile");
const User = require("../../models/User");
// @route GET api/profile/test
// @desc  tests profile routes
// @access public route
router.get("/test", (req, res) => {
  res.json({
    msg: "Profile works!",
  });
});

// @route GET api/profile/
// @desc  Get current users profile
// @access private route

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    // In profile we linked with the user schema and from there we find the user id
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "no Profile for the user";

          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status.json(err));
  }
);
// @route get api/profile/handle/:handle
// @desc  Get profile by handle
// @access profile route
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
});

// @route get api/profile/user/:user_id
// @desc  Get profile by user ID
// @access public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => res.status(404).json({ profile: "no profile found" }));
});

// @route get api/profile/all
// @desc  Get all prfiles
// @access public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json;
      }
      res.json(profiles);
    })
    .catch((err) => res.status(404).json({ profile: "no profile found" }));
});

// @route post api/profile/
// @desc  create or update users profile
// @access private route

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    // checking if the fields are sent from the form to the handle

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    // Skills in the form of Array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        // update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        // create
        // Check if handle exists this is particularly for SEO
        Profile.findOne({ handle: profileFields.handle }).then((profile) => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }
          // Save profile
          new Profile(profileFields)
            .save()
            .then((profile) => res.json(profile));
        });
      }
    });
  }
);
// @route post api/profile/experience
// @desc  add experience to profile
// @access private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };
      // Add to exp array
      profile.experience.unshift(newExp);
      profile.save().then((profile) => res.json(profile));
    });
  }
);

// @route post api/profile/education
// @desc  add education to profile
// @access private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };
      // Add to exp array
      profile.education.unshift(newEdu);
      profile.save().then((profile) => res.json(profile));
    });
  }
);
// @route delete api/profile/experience/:exp_id
// @desc  delete experience from profile
// @access private experience/:exp_id
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    

    Profile.findOne({ user: req.user.id }).then((profile) => {
      const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id);

    //  Splice out of array
    // Splice method remove it from the array
    profile.experience.splice(removeIndex,
      1)
      // Save
      profile.save().then(profile=>res.json(profile));

    })
    .catch(err=>res.status(400).json(err))
  }
);
// @route delete api/profile/education/:edu_id
// @desc  delete education from profile
// @access private education/:edu_id
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    

    Profile.findOne({ user: req.user.id }).then((profile) => {
      const removeIndex = profile.education.map(item=>item.id).indexOf(req.params.edu_id);

    //  Splice out of array
    // Splice method remove it from the array
    profile.education.splice(removeIndex,
      1)
      // Save
      profile.save().then(profile=>res.json(profile));

    })
    .catch(err=>res.status(400).json(err))
  }
);
// @route delete api/profile/
// @desc  delete user and profile
// @access private 
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
   Profile.findOneAndRemove({
     user: req.user.id
   }).then(()=>{
     User.findOneAndRemove({_i:req.user.id}).then(()=>res.json({success:true}))
   }) 

  }
);

module.exports = router;
