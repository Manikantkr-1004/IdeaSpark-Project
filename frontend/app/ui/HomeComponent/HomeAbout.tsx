import Image from "next/image";

interface AboutItem {
  title: string;
  points: string[];
  imgSrc: string;
}

const aboutData: AboutItem[] = [
  {
    title: "⚡Organize Ideas",
    points: [
      "Keep all your ideas in one place with our intuitive system. Create, edit, and categorize your ideas effortlessly.",
      "Generate ideas with your raw thoughts by using AI.",
      "You can take AI help to choose best ideas by selecting 2 ideas.",
      "Set Visibility - public so that anyone can see. By default it's private."
    ],
    imgSrc: "https://picsum.photos/500/300?random=OrganizeIdeas",
  },
  {
    title: "🧠 AI-Powered Creativity",
    points: [
      "Let AI convert your rough thoughts into structured ideas instantly.",
      "Compare two ideas and let AI suggest the better one."
    ],
    imgSrc: "https://picsum.photos/500/300?random=AIPower",
  },
  {
    title: "📅 Organized & Productive",
    points: [
      "Filter ideas by category, title for faster browsing.",
      "Use quick filters to find your best ideas instantly.",
      "Clean and distraction-free editor to focus on creativity."
    ],
    imgSrc: "https://picsum.photos/500/300?random=Productivity",
  }
];

export default function HomeAbout() {
  return (
    <section className="fixed-max-width m-auto px-3 md:px-5 lg:px-10 pt-16 md:pt-28 2xl:pt-32 relative">
      <h2 className="text-3xl font-bold mb-10 text-(--dark-color) m-auto underline-heading">💡 You Can Do 💡</h2>

      <div className="w-full relative">

        {
          aboutData.map((item) => (
            <div key={item.title} className="w-auto mb-5 sticky top-25 bg-slate-50 border border-dashed border-(--dark-color) rounded-md px-2 pb-2 pt-5 lg:pt-2 flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-4">
              <div className="w-full lg:w-auto flex flex-col gap-2">
                <h3 className="text-2xl font-semibold text-(--dark-color) text-center lg:text-left mb-2">{item.title}</h3>
                <ul className="list-disc list-inside pl-3">
                  {item.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className="w-full lg:w-auto rounded overflow-hidden">
                <Image className="w-full object-cover" src={item.imgSrc} alt={item.title} width={500} height={300} />
              </div>
            </div>
          ))
        }

      </div>

    </section>
  );
}