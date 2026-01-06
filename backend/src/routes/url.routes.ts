import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { urlPostBodySchema } from "../validation/request.validation.ts";
import { nanoid } from "nanoid";
import { shortenUrl } from "../services/urls.service.ts";

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

export default router;
