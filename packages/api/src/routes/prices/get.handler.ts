import * as HttpStatusCodes from "stoker/http-status-codes";
import { db } from "@arbitrum-connect/db/config";
import { cache } from "@arbitrum-connect/db";
import { eq } from "drizzle-orm";
import { AppRouteHandler } from "../../lib/types";
import { GetPriceRoute } from "./get.routes";
import envParsed from "../../envParsed";

/**
 * Get price endpoint handler
 * @type {AppRouteHandler<GetPriceRoute>}
 * @description Handles GET requests to retrieve cryptocurrency prices from CoinGecko API with 5-minute caching
 */
export const getPriceHandler: AppRouteHandler<GetPriceRoute> = async (c) => {
  try {
    const cacheKey = envParsed.PRICES_API_URL;
    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const cacheExpirationInSeconds = envParsed.PRICES_CACHE_EXPIRATION_MINUTES * 60; // 5 minutes in seconds

    // Check if we have a valid cache entry
    const [existingCache] = await db.select().from(cache).where(eq(cache.key, cacheKey)).limit(1);

    // If we have valid cached data, return it
    if (existingCache && existingCache.expiresAt > now) {
      const parsedData = JSON.parse(existingCache.data);
      return c.json(parsedData, HttpStatusCodes.OK);
    }

    // If no valid cache, fetch from CoinGecko API
    const response = await fetch(envParsed.PRICES_API_URL);

    if (!response.ok) {
      console.error("Failed to fetch prices from CoinGecko:", response.status, response.statusText);
      return c.json({ message: "Error retrieving prices" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    const priceData = await response.json();
    const expiresAt = now + cacheExpirationInSeconds;

    if (existingCache) {
      // Update existing cache entry
      await db
        .update(cache)
        .set({
          data: JSON.stringify(priceData),
          expiresAt,
          updatedAt: now,
        })
        .where(eq(cache.key, cacheKey));
    } else {
      // Insert new cache entry
      await db.insert(cache).values({
        key: cacheKey,
        data: JSON.stringify(priceData),
        expiresAt,
        createdAt: now,
        updatedAt: now,
      });
    }

    return c.json(priceData, HttpStatusCodes.OK);
  } catch (err) {
    console.error("Error retrieving prices:", err);
    return c.json({ message: "Error retrieving prices" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};
