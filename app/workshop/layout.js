import WorkshopNavbar from "@/app/components/Workshop/WorkshopNavbar";
import WorkshopFooter from "@/app/components/Workshop/WorkshopFooter";

export default function WorkshopLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <WorkshopNavbar/>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <WorkshopFooter/>
    </div>
  );
}