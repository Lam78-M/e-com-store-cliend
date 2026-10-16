import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import styles from "./CategoryMarquee.module.css";

const CATEGORIES = [
  { href: "/drinks", label: "Drinks", image: "/school_drinks.png" },
  { href: "/biscuits", label: "Biscuits", image: "/school-buicuits.png" },
  { href: "/fast-food", label: "Fast Food", image: "/schoo_fast_food.png" },
  { href: "/chocolate", label: "Chocolate", image: "/school_chocolate.png" },
  { href: "/snacks", label: "Snacks", image: "/school-canteen_items.png" },
  { href: "/desserts", label: "Desserts", image: "/School_desert.png" },
  { href: "/items", label: "School Supplies", image: "/school_stationary.png" },
];

function CategoryCards({ duplicate = false }) {
  return (
    <ul
      className={styles.categoryGroup}
      aria-hidden={duplicate ? "true" : undefined}
      aria-label={duplicate ? undefined : "Canteen categories and school supplies"}
    >
      {CATEGORIES.map(({ href, label, image }) => (
        <li key={href} className={styles.categoryItem}>
          <Link
            href={href}
            className={styles.categoryCard}
            tabIndex={duplicate ? -1 : undefined}
          >
            <Image
              src={image}
              alt={duplicate ? "" : `${label} at the school canteen`}
              fill
              sizes="(max-width: 640px) 75vw, 272px"
              className={styles.categoryImage}
            />
            <span className={styles.categoryDetails}>
              <span className={styles.categoryLabel}>{label}</span>
              <span className={styles.cardArrow} aria-hidden="true">
                <ArrowRight size={18} />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function CategoryMarquee() {
  return (
    <section
      className="mb-20 overflow-hidden border-y-4 border-[var(--c-caramel)] bg-[var(--c-teal)] text-[var(--c-paper)] "
      aria-labelledby="category-marquee-title "
    >
      <div className="mx-auto max-w-6xl py-10 sm:py-12">
        <div className="mb-6 flex items-center gap-3 px-4 sm:px-6">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--c-caramel)] text-[var(--c-paper)]">
            <Sparkles size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--c-paper)]/70">
              Made for break time
            </p>
            <h2
              id="category-marquee-title"
              className="text-xl font-extrabold tracking-tight sm:text-2xl"
            >
              Find your canteen favourites
            </h2>
          </div>
        </div>

        <div
          className={styles.marqueeViewport}
          role="region"
          aria-label="Browse canteen categories"
        >
          <div className={styles.marqueeTrack}>
            <CategoryCards />
            <CategoryCards duplicate />
          </div>
        </div>
        <p className="mt-3 px-4 text-xs text-[var(--c-paper)]/60 sm:px-6">
          Pick a category to see what’s on the menu.
        </p>
      </div>
    </section>
  );
}
