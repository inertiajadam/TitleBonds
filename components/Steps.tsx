const steps = [
  {
    title: "Tell us about your vehicle",
    body: "Your name and address, plus the year, make, model and VIN or serial number of the vehicle.",
  },
  {
    title: "Get your bond amount",
    body: "Most states set the bond at 1.5x the vehicle's value, determined by your DMV or a guide like NADA or Kelley Blue Book.",
  },
  {
    title: "Pay and print",
    body: "Bonds are typically issued the same day. Sign the original documents and file them with your DMV.",
  },
];

export function Steps() {
  return (
    <ol className="grid gap-6 md:grid-cols-3">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="relative rounded-card border border-navy-100 bg-navy-50/50 p-7"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-navy-800 text-base font-bold text-white">
            {index + 1}
          </span>
          <h3 className="mt-5 text-lg font-bold text-navy-950">{step.title}</h3>
          <p className="mt-2 leading-relaxed text-navy-600">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
