"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, Phone, Mail, Clock, Car, Plane, Train } from 'lucide-react'
import Link from 'next/link'

export default function OfficeLocationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/about">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-lime-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to About
              </Button>
            </Link>
          </div>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 p-4 bg-lime-100 rounded-xl">
              <MapPin className="w-8 h-8 text-lime-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Office Location</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Visit our modern office in Clark Freeport Zone, Pampanga, Philippines.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Office Overview */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Office</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Located in the heart of Clark Freeport Zone, our modern office provides an ideal environment 
                  for collaboration, innovation, and growth. Our facility is designed to support both 
                  in-person and hybrid work arrangements.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-lime-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-lime-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">Clark Freeport Zone, Pampanga, Philippines 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-lime-100 rounded-lg">
                      <Phone className="w-5 h-5 text-lime-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">+63 917 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-lime-100 rounded-lg">
                      <Mail className="w-5 h-5 text-lime-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">info@shoreagents.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-lime-100 rounded-lg">
                      <Clock className="w-5 h-5 text-lime-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Office Map Placeholder</p>
                  <p className="text-sm text-gray-500">Interactive map will be integrated here</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Office Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Office Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Modern Workspace</h3>
              </div>
              <p className="text-gray-600">
                Open-plan office with collaborative spaces, private meeting rooms, and dedicated workstations.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Phone className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Advanced Technology</h3>
              </div>
              <p className="text-gray-600">
                High-speed internet, video conferencing facilities, and the latest communication tools.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Mail className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Breakout Areas</h3>
              </div>
              <p className="text-gray-600">
                Comfortable lounge areas, coffee stations, and spaces for informal meetings and collaboration.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Clock className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">24/7 Access</h3>
              </div>
              <p className="text-gray-600">
                Secure building access for team members who need to work flexible hours or overtime.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Car className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Parking</h3>
              </div>
              <p className="text-gray-600">
                Free parking for employees and visitors with designated spaces for motorcycles and cars.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Security</h3>
              </div>
              <p className="text-gray-600">
                24/7 security personnel, CCTV monitoring, and secure access control systems.
              </p>
            </div>
          </div>
        </div>

        {/* Getting Here */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Getting Here</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Plane className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">By Air</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Clark International Airport (CRK) is just 15 minutes away from our office.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Direct flights from major cities</div>
                <div>• Taxi service available</div>
                <div>• Car rental options</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Train className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">By Public Transport</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Convenient public transportation options from Manila and surrounding areas.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• P2P bus service from Manila</div>
                <div>• Local jeepney routes</div>
                <div>• Tricycle service nearby</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-lime-100 rounded-lg">
                  <Car className="w-6 h-6 text-lime-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">By Car</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Easy access via major highways and well-maintained roads.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• NLEX/TPLEX access</div>
                <div>• GPS navigation available</div>
                <div>• Free parking on-site</div>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Amenities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nearby Amenities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Restaurants</h3>
              <p className="text-gray-600 text-sm">
                Various dining options within walking distance
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Shopping</h3>
              <p className="text-gray-600 text-sm">
                Malls and retail stores nearby
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Hotels</h3>
              <p className="text-gray-600 text-sm">
                Accommodation options for visitors
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-lime-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Banks</h3>
              <p className="text-gray-600 text-sm">
                Banking services and ATMs available
              </p>
            </div>
          </div>
        </div>

        {/* Visit Us */}
        <div className="bg-lime-600 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Plan Your Visit</h2>
          <p className="text-xl text-lime-100 mb-6">
            Ready to see our office in person? Schedule a visit and meet our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about/contact">
              <Button size="lg" className="bg-white text-lime-600 hover:bg-gray-100">
                Schedule a Visit
                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </Button>
            </Link>
            <Link href="/about/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-lime-700">
                Get Directions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
