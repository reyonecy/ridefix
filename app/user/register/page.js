import Registerform from "@/app/components/Auth/UserRegisterForm"; // Adjust the path to match your folder structure

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        <Registerform/>
      </div>
    </div>
  );
}
