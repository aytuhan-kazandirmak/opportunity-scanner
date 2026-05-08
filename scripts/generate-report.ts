import Anthropic from "@anthropic-ai/sdk";
import { OpportunityInputSchema, ScanReportSchema } from "../lib/schemas";
import { z } from "zod";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const today = new Date().toISOString().split("T")[0];

const SYSTEM_PROMPT = `You are a market research analyst specializing in software and AI opportunities for solo developers and small teams.

Your task: identify 5-8 fresh, concrete, solo-buildable software or AI opportunities. Focus on underserved niches with genuine demand.

For each opportunity, produce BOTH Turkish and English content. The Turkish content is primary; the English is a high-quality translation/adaptation.

Content quality requirements (NON-NEGOTIABLE):
- "what" / "what_en": Minimum 3 sentences. Describe what the product does, who it serves, and how it works. Be concrete — mention specific workflows, integrations, or user actions. No vague generalities.
- "why_it_matters" / "why_it_matters_en": Minimum 3 sentences. Explain the pain point with evidence (market size, frequency of complaint, failed alternatives). Include timing signals — why is NOW a good time?
- "missing_piece" / "missing_piece_en": Minimum 3 sentences. Explain the specific technical, distribution, or market gap. Why hasn't this been built yet? What's the unlock that makes it possible now?

Competitor requirements:
- List REAL companies/products. Include their actual URLs when known.
- Classify each: big-tech (Google, Microsoft, etc.), startup (funded product), solo-dev (indie maker), open-source (OSS project), other.
- If no direct competitors exist, use an empty array and set competition to "none".

Output a single raw JSON object matching this TypeScript type (no markdown, no code fences):

{
  scan_date: string,  // YYYY-MM-DD format
  summary: string,    // 2-3 sentence Turkish overview
  summary_en: string, // 2-3 sentence English overview
  opportunities: Array<{
    title: string,              // concise English title
    what: string,               // TR, min 3 sentences
    what_en: string,            // EN, min 3 sentences
    why_it_matters: string,     // TR, min 3 sentences
    why_it_matters_en: string,  // EN, min 3 sentences
    missing_piece: string,      // TR, min 3 sentences
    missing_piece_en: string,   // EN, min 3 sentences
    build_time: string,         // e.g. "3-5 weeks"
    competition: "none" | "low" | "medium" | "high",
    competitors: Array<{
      name: string,
      type: "big-tech" | "startup" | "solo-dev" | "open-source" | "other",
      url?: string
    }>,
    domain_idea?: string,       // optional domain suggestion
    verification: "unverified",
    source_url?: string
  }>
}`;

async function main() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const reportApiKey = process.env.REPORT_API_KEY;

  if (!siteUrl || !reportApiKey) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL and REPORT_API_KEY env vars are required",
    );
  }

  console.log(`Generating report for ${today}...`);

  const message = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: `Today's date is ${today}. Generate a fresh opportunity scan report. Research current trends, recent GitHub activity, and emerging market gaps. Produce the JSON output as specified.`,
      },
    ],
    system: SYSTEM_PROMPT,
  });

  const rawText = message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  let parsed: unknown;
  try {
    // Strip any accidental markdown fences
    const cleaned = rawText
      .replace(/^```(?:json)?\n?/m, "")
      .replace(/\n?```$/m, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON response:", rawText);
    throw e;
  }

  // Validate against our schema (lenient read schema for the outer wrapper)
  const BodySchema = z.object({
    scan_date: z.string(),
    opportunities: z.array(OpportunityInputSchema),
    summary: z.string().nullable().optional(),
    summary_en: z.string().nullable().optional(),
  });

  const validated = BodySchema.parse(parsed);
  // Override scan_date to today (in case Claude puts a different date)
  validated.scan_date = today;

  console.log(
    `Validated ${validated.opportunities.length} opportunities. Saving to DB...`,
  );

  const res = await fetch(`${siteUrl}/api/save-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": reportApiKey,
    },
    body: JSON.stringify(validated),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`save-report failed (${res.status}): ${body}`);
  }

  const result = await res.json();
  console.log("Report saved:", result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
