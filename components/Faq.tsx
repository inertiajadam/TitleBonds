import type { AnswerBlock } from "@/lib/states";

export function AnswerBlocks({ blocks }: { blocks: AnswerBlock[] }) {
  return (
    <div className="space-y-3 text-navy-700">
      {blocks.map((block, index) =>
        Array.isArray(block) ? (
          <ul key={index} className="ml-5 list-disc space-y-1.5">
            {block.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={index} className="leading-relaxed">
            {block}
          </p>
        ),
      )}
    </div>
  );
}

export function FaqItem({ q, a }: { q: string; a: AnswerBlock[] }) {
  return (
    <details className="group border-b border-navy-100 py-5 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-start justify-between gap-4 text-left">
        <h3 className="text-base font-semibold text-navy-900 sm:text-lg">{q}</h3>
        <span className="mt-1 shrink-0 text-navy-400 transition-transform group-open:rotate-45">
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden="true">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
        </span>
      </summary>
      <div className="mt-4">
        <AnswerBlocks blocks={a} />
      </div>
    </details>
  );
}
