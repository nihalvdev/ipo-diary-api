import axios from "axios";
import cron from "node-cron";
import { syncIpo } from "../services/ipoSync.service.js";

export const syncingIposJob = () => cron.schedule("0 * * * *", async () => {
    try {
        console.log("[CRON] Ipo syncing started...");

        const { data } = await axios.get(
            "https://www.nseindia.com/api/all-upcoming-issues?category=ipo",
            {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    Accept: "application/json"
                }
            }
        );

        const stats = await syncIpo(data || []);

        console.log("[CRON] Inserted: ", stats.inserted)
        console.log("[CRON] Updated: ", stats.updated)
        console.log("[CRON] Skipped: ", stats.skipped)
        console.log("[CRON] Ipo syncing completed...");
    } catch (err) {
        console.error("[CRON] Ipo syncing failed...", err)
    }
});