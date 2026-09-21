import { Icon, type IconName } from "@/components/Icon";

const points: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: "shield",
    title: "100% secure",
    body: "Our online title bond process is secure and we are committed to your privacy.",
  },
  {
    icon: "tag",
    title: "Unbeatable prices",
    body: "We monitor rates regularly so you get the best price available in your state.",
  },
  {
    icon: "bolt",
    title: "Fast and simple",
    body: "The application takes about two minutes. In many cases your bond is issued today.",
  },
];

export function TrustBar() {
  return (
    <div className="grid gap-px overflow-hidden rounded-card bg-navy-100 sm:grid-cols-3">
      {points.map((point) => (
        <div key={point.title} className="bg-white p-8">
          <span className="flex size-11 items-center justify-center rounded-xl bg-navy-900 text-white">
            <Icon name={point.icon} className="size-[22px]" />
          </span>
          <h3 className="mt-5 text-lg font-bold text-navy-950">{point.title}</h3>
          <p className="mt-2 leading-relaxed text-navy-600">{point.body}</p>
        </div>
      ))}
    </div>
  );
}
