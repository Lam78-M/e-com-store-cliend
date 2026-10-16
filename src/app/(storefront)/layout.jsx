import Navbar from "@/components/Navbar";
import SchoolHoursMarquee from "@/components/SchoolHoursMarquee";
import Footer from "@/components/Footer";

export default function StorefrontLayout({ children }) {
  return (
    <>
      <Navbar />
      <SchoolHoursMarquee />
      {children}
      <Footer />
    </>
  );
}
