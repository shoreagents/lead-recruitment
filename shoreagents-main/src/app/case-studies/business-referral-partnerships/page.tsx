import { SideNav } from "@/components/layout/SideNav";
import { ContentTracker } from "@/components/ContentTracker";

export default function BusinessReferralPartnershipsPage() {
  return (
    <ContentTracker 
      contentType="case_study" 
      contentId="business-referral-partnerships" 
      contentTitle="Business Referral Partnerships - Case Study"
      pageSection="main"
    >
      <div className="min-h-screen bg-gray-50 py-12">
        <SideNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Business Referral Partnerships</h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            How we built successful business referral partnerships that drive mutual growth and success.
          </p>
        </div>
      </div>
      </div>
    </ContentTracker>
  )
}
