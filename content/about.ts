import { site } from "@/lib/site";

/**
 * About page copy.
 *
 * Restricted to what is verifiable from the business's own material: the
 * states covered, the rate structure, the bond terms and the property types.
 * Anything a visitor would want that cannot be checked — years trading, staff,
 * licence numbers, ratings, volumes — is absent rather than approximated,
 * because an About page is exactly where an invented number does damage.
 */

export type AboutBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export const about: {
  title: string;
  lead: string;
  body: AboutBlock[];
} = {
  title: `About ${site.name}`,
  lead: "We do one thing: replace a vehicle title that has gone missing, with a surety bond the state will accept in its place.",
  body: [
    { type: "h2", text: "The problem we exist for" },
    {
      type: "p",
      text: "A vehicle title is the state's record of who owns what. Without it you cannot register, insure or sell the vehicle, however obviously it is yours. The title was lost in a move, the seller never handed it over, the vehicle came from an auction with no paperwork, or it was never titled at all.",
    },
    {
      type: "p",
      text: "A motor vehicle agency cannot simply take your word for it, because doing so would strand the people its records protect. A certificate of title bond resolves that: a surety stands behind your claim of ownership, the state issues a bonded title, and if someone later proves a better claim they have somewhere to go. That is the whole mechanism, and it is all we do.",
    },

    { type: "h2", text: "What we handle" },
    {
      type: "p",
      text: "We write certificate of title bonds across the states listed on this site, for the kinds of property states actually title:",
    },
    {
      type: "ul",
      items: [
        "Cars, trucks and semi-trucks",
        "RVs, motorhomes and travel trailers",
        "Motorcycles and ATVs",
        "Boats and other titled watercraft",
        "Mobile and manufactured homes",
        "Utility trailers and aircraft",
      ],
    },

    { type: "h2", text: "How we price" },
    {
      type: "p",
      text: "The bond amount is set by your state, usually as a multiple of the vehicle's value. What you pay is a premium on that amount: typically 1.5%, with a $100 minimum. Bonds under $30,000 are issued with no credit check, because the surety is assessing the vehicle's history rather than your finances.",
    },
    {
      type: "p",
      text: "Most bonds are issued the same day and many are delivered by email within minutes. The part that takes time is your state, not us: the valuation, any inspection, and the agency's own processing.",
    },

    { type: "h2", text: "How the bond gets written" },
    {
      type: "p",
      text: `A bond is issued by a surety company, not by a website. We take your details, work out the bond your state requires, and place it with our bond partner ${site.partner.name} and the surety that underwrites it. Every bond is subject to that surety's approval and to the requirements of the state agency that will accept it.`,
    },

    { type: "h2", text: "What we are not" },
    {
      type: "p",
      text: "We are not a law firm and nothing on this site is legal advice. If ownership of a vehicle is genuinely in dispute, that is a matter for a court rather than a surety bond, and we will tell you so rather than sell you a bond that cannot help.",
    },
    {
      type: "p",
      text: "We are also not your state's motor vehicle agency. Requirements change and the agency is always the authority on its own rules. Where our state pages cite a statute or a bond amount, they say which agency sets it so you can check.",
    },
  ],
};
