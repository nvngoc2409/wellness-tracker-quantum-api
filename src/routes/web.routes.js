import express from "express";

const router = express.Router();

router.get("/privacy", (req, res) => {
  res.render("privacy", { title: "Privacy Policy of Quantum Frequency for Wellness" });
});

router.get("/privacy-terms", (req, res) => {
  res.render("privacy_terms", { title: "Privacy Policy and Terms Conditions" });
});

router.get("/terms", (req, res) => {
  res.render("terms", { title: "Terms and Condition of Quantum Frequency for Wellness" });
});

router.get("/contact-form", (req, res) => {
  res.render("contact", { title: "Contact Us" });
});

export default router;
