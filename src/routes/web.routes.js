import express from "express";

const router = express.Router();

router.get("/privacy", (req, res) => {
  res.render("privacy", { title: "Privacy Policy of Wellness Tracker ft Quantum" });
});

router.get("/terms", (req, res) => {
  res.render("terms", { title: "Terms and Condition of Wellness Tracker ft Quantum" });
});

router.get("/contact-form", (req, res) => {
  res.render("contact", { title: "Contact Us" });
});

export default router;
