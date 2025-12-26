import express from "express";

const router = express.Router();

router.get("/privacy", (req, res) => {
  res.render("privacy", { title: "Privacy Policy" });
});

router.get("/terms", (req, res) => {
  res.render("terms", { title: "Terms of Service" });
});

router.get("/contact-form", (req, res) => {
  res.render("contact", { title: "Contact Us" });
});

export default router;
