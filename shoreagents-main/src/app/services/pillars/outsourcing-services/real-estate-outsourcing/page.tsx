import { SideNav } from "@/components/layout/SideNav";

export default function RealEstateOutsourcingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SideNav />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Real Estate Outsourcing
        </h1>
        <p className="text-xl text-gray-600">
          This is the Real Estate Outsourcing page
        </p>
      </div>
    </div>
  );
}
