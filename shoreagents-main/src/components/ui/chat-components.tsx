import React from 'react';

interface ServiceCardProps {
  serviceName: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ serviceName }) => {
  return (
    <div className="bg-white border border-lime-200 rounded-xl p-4 shadow-lg">
      <h4 className="font-semibold text-lime-800 mb-2">{serviceName}</h4>
      <p className="text-sm text-gray-600 mb-3">Learn more about our {serviceName.toLowerCase()} services</p>
      <button className="bg-lime-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-lime-600 transition-colors">
        Learn More
      </button>
    </div>
  );
};

interface TeamMemberCardProps {
  memberName: string;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ memberName }) => {
  return (
    <div className="bg-white border border-ocean-200 rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-full flex items-center justify-center text-white font-semibold">
          {memberName.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-ocean-800">{memberName}</h4>
          <p className="text-sm text-gray-600">Team Member</p>
        </div>
      </div>
    </div>
  );
};

interface CaseStudyCardProps {
  title: string;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ title }) => {
  return (
    <div className="bg-white border border-energy-200 rounded-xl p-4 shadow-lg">
      <h4 className="font-semibold text-energy-800 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 mb-3">Success story and results</p>
      <button className="bg-energy-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-energy-600 transition-colors">
        Read Case Study
      </button>
    </div>
  );
};

interface PricingCardProps {
  service: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({ service }) => {
  return (
    <div className="bg-white border border-lime-200 rounded-xl p-4 shadow-lg">
      <h4 className="font-semibold text-lime-800 mb-2">{service} Pricing</h4>
      <p className="text-sm text-gray-600 mb-3">Get detailed pricing information</p>
      <button className="bg-lime-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-lime-600 transition-colors">
        View Pricing
      </button>
    </div>
  );
};

interface ContactFormProps {
  service: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ service }) => {
  return (
    <div className="bg-white border border-ocean-200 rounded-xl p-4 shadow-lg">
      <h4 className="font-semibold text-ocean-800 mb-2">Contact Us About {service}</h4>
      <p className="text-sm text-gray-600 mb-3">Get in touch to discuss your {service.toLowerCase()} needs</p>
      <button className="bg-ocean-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-ocean-600 transition-colors">
        Contact Now
      </button>
    </div>
  );
};

// Component data type definition
interface ComponentData {
  type: 'service_card' | 'team_member' | 'case_study' | 'pricing' | 'contact_form';
  id: string;
  serviceName?: string;
  memberName?: string;
  title?: string;
  service?: string;
}

// Component renderer function
export const renderChatComponent = (componentData: ComponentData) => {
  switch (componentData.type) {
    case 'service_card':
      return <ServiceCard key={componentData.id} serviceName={componentData.serviceName || 'Service'} />;
    case 'team_member':
      return <TeamMemberCard key={componentData.id} memberName={componentData.memberName || 'Team Member'} />;
    case 'case_study':
      return <CaseStudyCard key={componentData.id} title={componentData.title || 'Case Study'} />;
    case 'pricing':
      return <PricingCard key={componentData.id} service={componentData.service || 'Service'} />;
    case 'contact_form':
      return <ContactForm key={componentData.id} service={componentData.service || 'Service'} />;
    default:
      return null;
  }
};

