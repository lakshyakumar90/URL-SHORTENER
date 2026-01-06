import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { urlPostBodySchema } from "../validation/request.validation.ts";
import { nanoid } from "nanoid";
import {
  deleteUrl,
  getAllUrlsOfUser,
  getUrlByShortCode,
  shortenUrl,
} from "../services/urls.service.ts";

const router = Router();

router.post("/shorten", authMiddleware, async (req, res) => {
  const validationResult = await urlPostBodySchema.safeParse(req.body);
  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.format() });
  }

  const { url, code } = validationResult.data;

  const shortCode = code || nanoid(7);
  const userId = req.user!.id;

  const result = await shortenUrl(url, shortCode, userId);

  if (!result) {
    return res.status(500).json({ message: "Failed to create shortened URL" });
  }

  return res.status(201).json({
    message: "URL shortened successfully",
    id: result.id,
    shortCode: result.shortCode,
    targetUrl: result.targetUrl,
  });
});

router.get("/codes", authMiddleware, async (req, res) => {
  const urls = await getAllUrlsOfUser(req.user!.id);

  if (!urls) {
    return res.status(404).json({ message: "URLs not found" });
  }

  return res.status(200).json({
    message: "URLs fetched successfully",
    urls,
  });
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const result = await deleteUrl(req.user!.id, id);
  if (!result) {
    return res.status(404).json({ message: "URL not found" });
  }
  return res.status(200).json({ message: "URL deleted successfully" });
});

router.get("/:shortcode", async (req, res) => {
  const { shortcode } = req.params;
  if (!shortcode) {
    return res.status(400).json({ message: "Shortcode is required" });
  }
  const url = await getUrlByShortCode(shortcode);
  if (!url) {
    return res.status(404).json({ message: "URL not found" });
  }
  return res.redirect(url.targetUrl);
});

export default router;
