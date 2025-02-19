import WorkshopNavbar from "@/app/components/Workshop/WorkshopNavbar";
import WorkshopFooter from "@/app/components/Workshop/WorkshopFooter";

export default function WorkshopLayout({ children }) {
  return (
    <>
     <WorkshopNavbar/>
      <main>{children}</main>
      <WorkshopFooter/>
    </>
  );
}