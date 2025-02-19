import UserNavbar from "@/app/components/UserComponents/userNavbar";
import UserFooter from "@/app/components/UserComponents/UserFooter";

export default function UserLayout({ children }) {
  return (
    <>
      <UserNavbar />
      <main>{children}</main>
      <UserFooter />
    </>
  );
}