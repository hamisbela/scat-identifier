import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, AlertTriangle, BookOpen, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Free Scat Identifier</h3>
            </div>
            <p className="text-gray-600">
              Your trusted educational companion for wildlife scat identification and animal tracking information. 
              Powered by advanced AI technology for educational purposes only.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Educational Resources</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Scat Identifier
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-gray-400" />
                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                  About Wildlife Tracking
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">
                  Get Help
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Our Project</h3>
            <p className="text-gray-600 mb-4">
              Help us maintain and improve this free educational tool for the wildlife enthusiast community.
            </p>
            <a
              href="https://roihacks.gumroad.com/l/dselxe?utm_campaign=donation-footer&utm_medium=website&utm_source=scat-identifier"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors"
            >
              Buy us a coffee
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t">
          <div className="text-center text-gray-600">
            <p className="mb-2">&copy; {new Date().getFullYear()} Free Scat Identifier. Helping you understand the wildlife world.</p>
            <p className="text-sm">
              For educational purposes only. Learn about the fascinating world of animal tracking safely and responsibly.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}