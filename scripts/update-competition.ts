import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/types/database";
import { OpportunitySchema } from "../lib/schemas";
import { z } from "zod";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const DAYS_TO_UPDATE = 30;

async function updateReportCompetition(
  scanDate: string,
  opportunities: z.infer<typeof OpportunitySchema>[],
) {
  const prompt = `Today is ${new Date().toISOString().split("T")[0]}.

Below are software/AI opportunities from a scan on ${scanDate}. For each opportunity, review its competition status and update:
1. competition: "none" | "low" | "medium" | "high" — based on current market
2. competitors: up-to-date list of real companies/products competing in this space

Be thorough. If new players have emerged since ${scanDate}, add them. If old ones shut down, remove them.

Return ONLY a JSON array of the updated opportunities (same structure, no extra keys). Keep all other fields unchanged.

Opportunities:
${JSON.stringify(opportunities, null, 2)}`;

  const message = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  const cleaned = rawText
    .replace(/^```(?:json)?\n?/m, "")
    .replace(/\n?```$/m, "")
    .trim();
  const parsed: unknown = JSON.parse(cleaned);

  return z.array(OpportunitySchema).parse(parsed);
}

async function main() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const reportApiKey = process.env.REPORT_API_KEY;

  if (!siteUrl || !reportApiKey) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL and REPORT_API_KEY env vars are required",
    );
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DAYS_TO_UPDATE);
  const cutoffDate = cutoff.toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];

  console.log(`Fetching reports from ${cutoffDate} to ${today}...`);

  const { data: reports, error } = await supabase
    .from("scan_results")
    .select("scan_date, opportunities")
    .gte("scan_date", cutoffDate)
    .lt("scan_date", today) // skip today — just generated
    .order("scan_date", { ascending: false });

  if (error) throw new Error(error.message);
  if (!reports || reports.length === 0) {
    console.log("No reports to update.");
    return;
  }

  console.log(`Updating competition for ${reports.length} report(s)...`);

  for (const report of reports) {
    const opportunities = z
      .array(OpportunitySchema)
      .parse(report.opportunities);
    console.log(
      `  → ${report.scan_date}: ${opportunities.length} opportunities`,
    );

    const updated = await updateReportCompetition(
      report.scan_date,
      opportunities,
    );

    const res = await fetch(`${siteUrl}/api/update-competition`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": reportApiKey,
      },
      body: JSON.stringify({
        scan_date: report.scan_date,
        opportunities: updated,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(
        `  ✗ Failed to update ${report.scan_date} (${res.status}): ${body}`,
      );
    } else {
      console.log(`  ✓ Updated ${report.scan_date}`);
    }
  }

  console.log("Competition update complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
