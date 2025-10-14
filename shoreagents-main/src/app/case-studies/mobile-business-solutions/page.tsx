import { SideNav } from "@/components/layout/SideNav";

export default function MobileBusinessSolutionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SideNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mobile Business Solutions</h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            How we developed and implemented mobile business solutions for our clients.
          </p>
        </div>
      </div>
    </div>
  )
}










