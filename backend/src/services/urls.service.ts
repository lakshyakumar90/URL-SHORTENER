import { and, eq } from "drizzle-orm";
import db from "../db/index.ts";
import { urlsTable } from "../models/url.model.ts";

const shortenUrl = async (url: string, code: string, userId: string) => {
  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode: code,
      targetUrl: url,
      userId: userId,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetUrl: urlsTable.targetUrl,
    });

  if (!result) {
    throw new Error("Failed to shorten URL");
  }

  return result;
};

const getUrlByShortCode = async (shortcode: string) => {
  const [result] = await db
    .select({
      targetUrl: urlsTable.targetUrl,
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, shortcode));

  if (!result) {
    throw new Error("URL not found");
  }

  return result;
};

const getAllUrlsOfUser = async (userId: string) => {
  const urls = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.userId, userId));
  return urls;
};

const deleteUrl = async (userId: string, id: string) => {
  const result = await db
    .delete(urlsTable)
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, userId)));
  return result;
};

export { shortenUrl, getUrlByShortCode, getAllUrlsOfUser, deleteUrl };
