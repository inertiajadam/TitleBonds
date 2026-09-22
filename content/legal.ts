import { site } from "@/lib/site";

/**
 * Privacy policy and terms.
 *
 * Written against what this site actually does rather than from a template:
 * the quote form's real fields, the two analytics tools really installed, and
 * the real onward recipient of a lead. A boilerplate policy that does not
 * describe the site is worse than none, because it is a public statement that
 * happens to be wrong.
 *
 * Anything that is a legal choice rather than a fact about the code — the
 * governing state, the entity form, retention periods — is kept general here
 * and needs counsel to settle before this is relied on.
 */

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type LegalDoc = {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  body: LegalBlock[];
};

const P = (text: string): LegalBlock => ({ type: "p", text });
const H2 = (text: string): LegalBlock => ({ type: "h2", text });
const UL = (items: string[]): LegalBlock => ({ type: "ul", items });

export const privacyPolicy: LegalDoc = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  updated: "2026-09-22",
  intro: `This policy explains what ${site.name} collects when you use this website, why we collect it, and who else sees it.`,
  body: [
    H2("Who we are"),
    P(`${site.name}, ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}. You can reach us on ${site.phone} or at ${site.email}.`),

    H2("Information you give us"),
    P("If you request a quote, we ask for the details needed to prepare one and to write a certificate of title bond:"),
    UL([
      "Your name",
      "Your phone number and email address",
      "The state the bond is for",
      "The vehicle's year, make and model",
      "The vehicle identification number or serial number",
    ]),
    P("We use these to prepare your quote and to contact you about it. We do not sell this information, and we do not use it for unrelated marketing."),

    H2("Who else receives it"),
    P(`A certificate of title bond is written by a surety, not by this website. To produce a quote and issue a bond we share the details above with our bond partner, ${site.partner.name} (${site.partner.url}), and with the surety company that underwrites the bond. They use it to price and issue your bond and to meet their own record-keeping obligations.`),
    P("We may also disclose information where the law requires it, or to establish or defend a legal claim."),

    H2("Information collected automatically"),
    P("Like most websites, this one records how it is used so we can see what is working. Two tools do that:"),
    UL([
      "Google Analytics 4, which records pages viewed, how visitors arrive, approximate location from IP address, and whether someone clicks an apply button or a phone number.",
      "Microsoft Clarity, which records anonymised session replays and heatmaps showing how pages are scrolled and clicked.",
    ]),
    P("Session replay is the one worth being explicit about. Clarity reconstructs what a page looked like as you used it. The quote form is masked, so what you type into it is never captured in a recording. We do not use replays to identify individuals; we use them to find pages that confuse people."),
    P("Both tools set cookies. Both are operated by their own companies under their own privacy policies, and both process data outside this site."),

    H2("Your choices"),
    UL([
      "You can block or delete cookies in your browser. The site works without them.",
      "You can opt out of Google Analytics across all sites using Google's browser add-on.",
      "You can ask us what we hold about you, ask us to correct it, or ask us to delete it, by emailing " + site.email + ".",
      "If you are a California resident, you may have additional rights over your personal information, including the right to know what is collected and to request deletion. We do not sell personal information.",
    ]),

    H2("How long we keep it"),
    P("We keep quote requests for as long as we need them to handle your enquiry and to meet the record-keeping obligations that apply to surety business. Analytics data is kept for the retention period set in the tools themselves."),

    H2("Children"),
    P("This site is for adults arranging bonds on vehicles they own. It is not directed at children and we do not knowingly collect information from anyone under 18."),

    H2("Security"),
    P("Information submitted through this site is sent over an encrypted connection. No method of transmission or storage is completely secure, and we cannot guarantee absolute security."),

    H2("Changes"),
    P("If this policy changes we will update the date at the top of this page."),

    H2("Contact"),
    P(`Questions about this policy can go to ${site.email} or ${site.phone}.`),
  ],
};

export const terms: LegalDoc = {
  slug: "terms",
  title: "Terms of Use",
  updated: "2026-09-22",
  intro: `These terms govern your use of ${site.url}. By using the site you accept them.`,
  body: [
    H2("What this site is"),
    P(`${site.name} provides information about certificate of title bonds and takes quote requests. The site itself does not issue bonds. Bonds are written by a surety company through our bond partner, ${site.partner.name}, and every bond is subject to that surety's underwriting, its approval, and the requirements of the state motor vehicle agency involved.`),

    H2("Quotes are not offers"),
    P("Rates and bond amounts shown on this site are indicative. The premium you pay depends on the bond amount your state requires, which depends on how your state values your vehicle. Nothing on this site is a binding offer, and submitting a quote request does not create a contract or guarantee that a bond will be issued."),

    H2("This is not legal advice"),
    P("The guides and state pages here describe how bonded titles generally work. They are not legal advice and are not a substitute for your state's own requirements or for advice from an attorney. If ownership of a vehicle is genuinely disputed, that is a matter for a court rather than for a surety bond."),

    H2("Accuracy"),
    P("State requirements, bond amounts, statutes and terms change, and agencies do not always announce changes. We keep this site as current as we reasonably can, and we do not warrant that every figure on it is correct at the moment you read it. Your state's motor vehicle agency is the authority on its own requirements."),

    H2("Links to other sites"),
    P("This site links to government agencies, legal reference works and our bond partner. We do not control those sites and are not responsible for their content or their privacy practices."),

    H2("Your responsibilities"),
    UL([
      "Give accurate information. A bond written on wrong vehicle details is not valid and will be rejected by the state.",
      "Do not request a bond on a vehicle you do not have a genuine claim to own.",
      "Do not use this site to break the law, to interfere with its operation, or to extract its content systematically.",
    ]),

    H2("Our content"),
    P(`The text, design, photographs and code on this site belong to ${site.name} or are licensed to it. You may read and share pages. You may not copy the site's content for your own commercial use without permission.`),

    H2("Disclaimer and liability"),
    P("This site is provided as is, without warranties of any kind, express or implied. To the fullest extent the law allows, we are not liable for indirect or consequential loss arising from your use of the site or reliance on its contents."),
    P("Nothing in these terms limits any liability that cannot lawfully be limited."),

    H2("Governing law"),
    P("These terms are governed by the laws of the State of Tennessee, where the agency is based, without regard to its conflict of law rules."),

    H2("Changes"),
    P("We may update these terms. The date at the top of this page shows when they last changed, and continuing to use the site means you accept the current version."),

    H2("Contact"),
    P(`Questions about these terms can go to ${site.email} or ${site.phone}.`),
  ],
};

export const legalDocs = [privacyPolicy, terms];
