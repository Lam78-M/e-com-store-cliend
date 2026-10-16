import CategoryMarquee from "@/components/CategoryMarquee";
import HomeHero from "@/components/HomeHero";

export default function Home() {
  return (
    <main className="flex-1">
      <HomeHero />
      <CategoryMarquee />
    </main>
  );
}
