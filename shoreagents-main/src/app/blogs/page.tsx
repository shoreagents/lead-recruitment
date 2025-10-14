'use client';

import { useState, useMemo } from 'react';
import { SideNav } from "@/components/layout/SideNav";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, Calendar, User } from 'lucide-react';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  thumbnail: string;
  publishDate: string;
  author: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Outsourcing Services',
    description: 'Discover comprehensive outsourcing solutions to streamline your business operations and reduce costs.',
    url: '/outsourcing/',
    category: 'Outsourcing',
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop',
    publishDate: '2024-01-15',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Virtual Assistant Services',
    description: 'Professional virtual assistants to handle your administrative tasks and boost productivity.',
    url: '/virtual-assistant/',
    category: 'Virtual Assistant',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    publishDate: '2024-01-20',
    author: 'ShoreAgents Team',
    readTime: '4 min read'
  },
  {
    id: '3',
    title: 'Real Estate Outsourcing',
    description: 'Specialized real estate support services to help agents and brokers grow their business.',
    url: '/real-estate-outsourcing/',
    category: 'Real Estate',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
    publishDate: '2024-01-25',
    author: 'ShoreAgents Team',
    readTime: '6 min read'
  },
  {
    id: '4',
    title: 'Property Management Outsourcing',
    description: 'Complete property management solutions to handle tenant relations and property maintenance.',
    url: '/property-management-outsourcing/',
    category: 'Property Management',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
    publishDate: '2024-02-01',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '5',
    title: 'Construction Outsourcing',
    description: 'Expert construction support services for project management and administrative tasks.',
    url: '/construction-outsourcing/',
    category: 'Construction',
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=250&fit=crop',
    publishDate: '2024-02-05',
    author: 'ShoreAgents Team',
    readTime: '7 min read'
  },
  {
    id: '6',
    title: 'Insurance Outsourcing',
    description: 'Comprehensive insurance support services to streamline claims and customer service.',
    url: '/insurance-outsourcing/',
    category: 'Insurance',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop',
    publishDate: '2024-02-10',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '7',
    title: 'Mortgage Outsourcing',
    description: 'Specialized mortgage processing and support services for lenders and brokers.',
    url: '/mortgage-outsourcing/',
    category: 'Mortgage',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
    publishDate: '2024-02-15',
    author: 'ShoreAgents Team',
    readTime: '6 min read'
  },
  {
    id: '8',
    title: 'Legal Outsourcing',
    description: 'Professional legal support services including document review and case management.',
    url: '/legal-outsourcing/',
    category: 'Legal',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop',
    publishDate: '2024-02-20',
    author: 'ShoreAgents Team',
    readTime: '8 min read'
  },
  {
    id: '9',
    title: 'Architectural Outsourcing',
    description: 'Expert architectural design and drafting services for construction projects.',
    url: '/architectural-outsourcing/',
    category: 'Architecture',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop',
    publishDate: '2024-02-25',
    author: 'ShoreAgents Team',
    readTime: '7 min read'
  },
  {
    id: '10',
    title: 'Drafting Outsourcing',
    description: 'Professional CAD drafting and technical drawing services for various industries.',
    url: '/drafting-outsourcing/',
    category: 'Drafting',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
    publishDate: '2024-03-01',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '11',
    title: 'Engineering Outsourcing',
    description: 'Comprehensive engineering support services for design and project management.',
    url: '/engineering-outsourcing/',
    category: 'Engineering',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
    publishDate: '2024-03-05',
    author: 'ShoreAgents Team',
    readTime: '6 min read'
  },
  {
    id: '12',
    title: 'Estimating Outsourcing',
    description: 'Accurate cost estimation services for construction and engineering projects.',
    url: '/estimating-outsourcing/',
    category: 'Estimating',
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=250&fit=crop',
    publishDate: '2024-03-10',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '13',
    title: 'SEO Outsourcing',
    description: 'Expert SEO services to improve your website visibility and search rankings.',
    url: '/seo-outsourcing/',
    category: 'SEO',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    publishDate: '2024-03-15',
    author: 'ShoreAgents Team',
    readTime: '6 min read'
  },
  {
    id: '14',
    title: 'Graphic Design Outsourcing',
    description: 'Creative graphic design services for branding, marketing, and visual communication.',
    url: '/graphic-design-outsourcing/',
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=250&fit=crop',
    publishDate: '2024-03-20',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '15',
    title: 'Accounting Outsourcing',
    description: 'Professional accounting and bookkeeping services for businesses of all sizes.',
    url: '/accounting-outsourcing/',
    category: 'Accounting',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
    publishDate: '2024-03-25',
    author: 'ShoreAgents Team',
    readTime: '7 min read'
  },
  {
    id: '16',
    title: 'Bookkeeping Outsourcing',
    description: 'Accurate bookkeeping services to maintain your financial records and compliance.',
    url: '/bookkeeping-outsourcing/',
    category: 'Bookkeeping',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
    publishDate: '2024-03-30',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '17',
    title: 'Website Outsourcing',
    description: 'Professional web development and design services for modern businesses.',
    url: '/website-outsourcing/',
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    publishDate: '2024-04-01',
    author: 'ShoreAgents Team',
    readTime: '6 min read'
  },
  {
    id: '18',
    title: 'Content Writing Outsourcing',
    description: 'High-quality content writing services for blogs, websites, and marketing materials.',
    url: '/content-writing-outsourcing/',
    category: 'Content Writing',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop',
    publishDate: '2024-04-05',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '19',
    title: 'Real Estate Virtual Assistant',
    description: 'Specialized virtual assistants for real estate professionals and agencies.',
    url: '/real-estate-virtual-assistant/',
    category: 'Real Estate VA',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
    publishDate: '2024-04-10',
    author: 'ShoreAgents Team',
    readTime: '4 min read'
  },
  {
    id: '20',
    title: 'Property Management Virtual Assistant',
    description: 'Virtual assistants specialized in property management tasks and tenant relations.',
    url: '/property-management-virtual-assistant/',
    category: 'Property Management VA',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
    publishDate: '2024-04-15',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '21',
    title: 'Architect Virtual Assistant',
    description: 'Virtual assistants with architectural expertise for design and project support.',
    url: '/architect-virtual-assistant/',
    category: 'Architecture VA',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop',
    publishDate: '2024-04-20',
    author: 'ShoreAgents Team',
    readTime: '6 min read'
  },
  {
    id: '22',
    title: 'Construction Virtual Assistant',
    description: 'Virtual assistants specialized in construction project management and coordination.',
    url: '/construction-virtual-assistant/',
    category: 'Construction VA',
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=250&fit=crop',
    publishDate: '2024-04-25',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '23',
    title: 'Engineering Virtual Assistant',
    description: 'Virtual assistants with engineering background for technical project support.',
    url: '/engineering-virtual-assistant/',
    category: 'Engineering VA',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
    publishDate: '2024-04-30',
    author: 'ShoreAgents Team',
    readTime: '6 min read'
  },
  {
    id: '24',
    title: 'Mortgage Virtual Assistant',
    description: 'Virtual assistants specialized in mortgage processing and loan support.',
    url: '/mortgage-virtual-assistant/',
    category: 'Mortgage VA',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
    publishDate: '2024-05-01',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '25',
    title: 'Insurance Virtual Assistant',
    description: 'Virtual assistants with insurance expertise for claims and customer service.',
    url: '/insurance-virtual-assistant/',
    category: 'Insurance VA',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop',
    publishDate: '2024-05-05',
    author: 'ShoreAgents Team',
    readTime: '4 min read'
  },
  {
    id: '26',
    title: 'Legal Virtual Assistant',
    description: 'Virtual assistants with legal background for document review and case management.',
    url: '/legal-virtual-assistant/',
    category: 'Legal VA',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop',
    publishDate: '2024-05-10',
    author: 'ShoreAgents Team',
    readTime: '7 min read'
  },
  {
    id: '27',
    title: 'Drafting Virtual Assistant',
    description: 'Virtual assistants specialized in CAD drafting and technical drawings.',
    url: '/drafting-virtual-assistant/',
    category: 'Drafting VA',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
    publishDate: '2024-05-15',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '28',
    title: 'Estimating Virtual Assistant',
    description: 'Virtual assistants with estimating expertise for cost analysis and project planning.',
    url: '/estimating-virtual-assistant/',
    category: 'Estimating VA',
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=250&fit=crop',
    publishDate: '2024-05-20',
    author: 'ShoreAgents Team',
    readTime: '6 min read'
  },
  {
    id: '29',
    title: 'AI Virtual Assistants',
    description: 'Cutting-edge AI-powered virtual assistants for modern business automation.',
    url: '/ai-virtual-assistants/',
    category: 'AI Technology',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
    publishDate: '2024-05-25',
    author: 'ShoreAgents Team',
    readTime: '8 min read'
  },
  {
    id: '30',
    title: 'SEO Virtual Assistant',
    description: 'Virtual assistants specialized in SEO optimization and digital marketing.',
    url: '/seo-virtual-assistant/',
    category: 'SEO VA',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    publishDate: '2024-05-30',
    author: 'ShoreAgents Team',
    readTime: '6 min read'
  },
  {
    id: '31',
    title: 'Marketing Virtual Assistant',
    description: 'Virtual assistants with marketing expertise for campaigns and brand promotion.',
    url: '/marketing-virtual-assistant/',
    category: 'Marketing VA',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=250&fit=crop',
    publishDate: '2024-06-01',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '32',
    title: 'Bookkeeping Virtual Assistant',
    description: 'Virtual assistants specialized in bookkeeping and financial record management.',
    url: '/bookkeeping-virtual-assistant/',
    category: 'Bookkeeping VA',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
    publishDate: '2024-06-05',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '33',
    title: 'Graphic Design Virtual Assistant',
    description: 'Virtual assistants with graphic design skills for creative projects.',
    url: '/graphic-design-virtual-assistant/',
    category: 'Design VA',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=250&fit=crop',
    publishDate: '2024-06-10',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '34',
    title: 'Social Media Virtual Assistant',
    description: 'Virtual assistants specialized in social media management and content creation.',
    url: '/social-media-virtual-assistant/',
    category: 'Social Media VA',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop',
    publishDate: '2024-06-15',
    author: 'ShoreAgents Team',
    readTime: '6 min read'
  },
  {
    id: '35',
    title: 'Content Writing Virtual Assistant',
    description: 'Virtual assistants with content writing expertise for blogs and marketing materials.',
    url: '/content-writing-virtual-assistant/',
    category: 'Content Writing VA',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop',
    publishDate: '2024-06-20',
    author: 'ShoreAgents Team',
    readTime: '5 min read'
  },
  {
    id: '36',
    title: 'Administrative Virtual Assistant',
    description: 'General administrative virtual assistants for day-to-day business operations.',
    url: '/administrative-virtual-assistant/',
    category: 'Administrative VA',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    publishDate: '2024-06-25',
    author: 'ShoreAgents Team',
    readTime: '4 min read'
  },
  {
    id: '37',
    title: 'Accounting Virtual Assistant',
    description: 'Virtual assistants with accounting expertise for financial management.',
    url: '/accounting-virtual-assistant/',
    category: 'Accounting VA',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
    publishDate: '2024-06-30',
    author: 'ShoreAgents Team',
    readTime: '6 min read'
  }
];

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = useMemo(() => {
    if (!searchTerm) return blogPosts;
    
    return blogPosts.filter(blog => 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleBlogClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover insights, tips, and resources about outsourcing, virtual assistants, and business growth.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search blogs by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-lime-200 focus:border-lime-500 focus:ring-lime-500"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'} found
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <Card 
              key={blog.id} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-lime-200 hover:border-lime-300"
              onClick={() => handleBlogClick(blog.url)}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={blog.thumbnail}
                  alt={blog.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-lime-600 text-white hover:bg-lime-700">
                    {blog.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-lime-600 transition-colors duration-200">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(blog.publishDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{blog.author}</span>
                    </div>
                  </div>
                  <span className="text-lime-600 font-medium">{blog.readTime}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lime-600 font-medium group-hover:text-lime-700 transition-colors duration-200">
                    Read More
                  </span>
                  <ExternalLink className="w-4 h-4 text-lime-600 group-hover:text-lime-700 transition-colors duration-200" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse all our articles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
