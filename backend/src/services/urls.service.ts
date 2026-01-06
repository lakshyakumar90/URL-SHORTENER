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
}

export { shortenUrl };
