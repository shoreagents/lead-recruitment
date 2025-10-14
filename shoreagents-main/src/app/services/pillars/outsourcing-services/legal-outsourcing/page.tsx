import { SideNav } from "@/components/layout/SideNav";

export default function LegalOutsourcingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SideNav />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Legal Outsourcing
        </h1>
        <p className="text-xl text-gray-600">
          This is the Legal Outsourcing page
        </p>
      </div>
    </div>
  );
}
