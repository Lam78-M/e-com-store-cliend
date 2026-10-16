import styles from "./SchoolHoursMarquee.module.css";

const HOURS = [
  { icon: "🏫", label: "School Hours:", time: "7:00 AM – 4:00 PM" },
  { icon: "🍱", label: "Tiffin Time:", time: "10:40 AM – 12:00 PM" },
];

function HoursGroup({ duplicate = false }) {
  return (
    <div
      className={styles.hoursGroup}
      aria-hidden={duplicate ? "true" : undefined}
    >
      {HOURS.map(({ icon, label, time }) => (
        <span className={styles.hoursItem} key={label}>
          <span className={styles.hoursIcon} aria-hidden="true">
            {icon}
          </span>
          <span className={styles.hoursLabel}>{label}</span>
          <span>{time}</span>
          <span className={styles.separator} aria-hidden="true">
            •
          </span>
        </span>
      ))}
    </div>
  );
}

export default function SchoolHoursMarquee() {
  return (
    <section
      className={styles.announcement}
      aria-label="School hours and tiffin time"
    >
      <div className={styles.viewport}>
        <div className={styles.track}>
          <HoursGroup />
          <HoursGroup duplicate />
        </div>
      </div>
    </section>
  );
}
