import UserNavbar from "@/app/components/UserComponents/UserNavbar";
import UserFooter from "@/app/components/UserComponents/UserFooter";

export default function UserLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <UserNavbar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <UserFooter/>
    </div>
  );
}