import { SideNav } from "@/components/layout/SideNav";

export default function PropertyManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SideNav />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Property Management
        </h1>
        <p className="text-xl text-gray-600">
          This is the Property Management page
        </p>
      </div>
    </div>
  );
}
