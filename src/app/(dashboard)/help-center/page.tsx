'use client';

import { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Mail,
  Phone,
  MessageCircle,
  ArrowRight,
  BookOpen,
  Zap,
  Shield,
  Users
} from 'lucide-react';

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: 'Getting Started',
    question: 'How do I create my first task?',
    answer:
      'Navigate to Dashboard and click "Add". Fill task title, description and status then create the task.'
  },
  {
    id: 2,
    category: 'Getting Started',
    question: 'How do I invite team members?',
    answer:
      'Go to Settings → Team Members → Add Member and send an invite via email.'
  },
  {
    id: 3,
    category: 'Tasks',
    question: 'What is list vs kanban view?',
    answer:
      'List view shows tasks in table format while kanban organizes them in workflow columns.'
  },
  {
    id: 4,
    category: 'Tasks',
    question: 'Can I assign tasks to members?',
    answer:
      'Yes. Click assign on any task and select the team member.'
  },
  {
    id: 5,
    category: 'Leads',
    question: 'How do I manage leads?',
    answer:
      'Use the Leads page to create, assign, update status and track potential clients.'
  },
  {
    id: 6,
    category: 'Calendar',
    question: 'How do I create events?',
    answer:
      'Click New Event in the Calendar page and fill event details.'
  }
];

const resources = [
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Complete product guide'
  },
  {
    icon: Zap,
    title: 'Video Tutorials',
    description: 'Step by step walkthroughs'
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Learn how we protect data'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Ask and share knowledge'
  }
];

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    contact: 'support@digitalpylot.com',
    time: 'Reply within 24h'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    contact: 'Website chat',
    time: 'Mon-Fri 9AM-5PM'
  },
  {
    icon: Phone,
    title: 'Phone',
    contact: '+1 (555) 123-4567',
    time: 'Mon-Fri 9AM-5PM'
  }
];

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const categories = [...new Set(faqData.map((item) => item.category))];

  const filtered = faqData.filter((item) => {
    const search =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const cat = !category || item.category === category;

    return search && cat;
  });

  return (
    <div className="space-y-14 pb-12">

      {/* HERO */}

      <div className="bg-orange-50 border border-orange-200 rounded-3xl p-12 shadow-sm">

        <h1 className="text-4xl font-bold mb-4">
          Help Center
        </h1>

        <p className="text-orange-500 mb-6 text-lg max-w-xl">
          Find answers, tutorials and guides to get the most out of Digital Pylot.
        </p>

        <div className="relative max-w-xl">

          <Search className="absolute left-4 top-3.5 w-5 h-5 text-orange-200" />

          <input
            type="text"
            placeholder="Search help articles..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-amber-400 text-gray-900 outline-none focus:ring-2 focus:ring-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

      </div>


      {/* RESOURCES */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {resources.map((item, i) => {

          const Icon = item.icon;

          return (
            <div
              key={i}
              className="bg-white  rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >

              <div className="bg-orange-100/70 p-3 rounded-lg w-fit mb-4 group-hover:bg-orange-200 transition">

                <Icon className="w-6 h-6 text-orange-600" />

              </div>

              <h3 className="font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {item.description}
              </p>

              <div className="flex items-center text-orange-600 text-sm font-medium">

                Learn more

                <ArrowRight className="w-4 h-4 ml-2" />

              </div>

            </div>
          );
        })}
      </div>


      {/* FAQ */}

      <div>

        <h2 className="text-3xl font-bold mb-2">
          Frequently Asked Questions
        </h2>

        <p className="text-gray-500 mb-6">
          Quick answers to common questions
        </p>


        {/* CATEGORY */}

        <div className="flex flex-wrap gap-2 mb-6">

          <button
            onClick={() => setCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              !category
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All
          </button>

          {categories.map((cat) => (

            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                category === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>

          ))}

        </div>


        {/* FAQ LIST */}

        <div className="space-y-3">

          {filtered.length === 0 && (

            <div className="text-center py-10 bg-gray-50 rounded-xl">

              <HelpCircle className="mx-auto mb-2 text-gray-300" />

              <p>No results found</p>

            </div>

          )}

          {filtered.map((item) => (

            <div
              key={item.id}
              className=" rounded-2xl bg-white overflow-hidden hover:shadow-md transition"
            >

              <button
                className="w-full flex justify-between p-6 text-left"
                onClick={() =>
                  setExpandedId(
                    expandedId === item.id ? null : item.id
                  )
                }
              >

                <div>

                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                    {item.category}
                  </span>

                  <h3 className="font-semibold text-lg mt-2">
                    {item.question}
                  </h3>

                </div>

                <ChevronDown
                  className={`transition-transform ${
                    expandedId === item.id ? 'rotate-180' : ''
                  }`}
                />

              </button>

              {expandedId === item.id && (

                <div className="px-6 pb-6 text-gray-600  bg-gray-50">

                  {item.answer}

                </div>

              )}

            </div>

          ))}

        </div>

      </div>


      {/* CONTACT */}

      <div>

        <h2 className="text-3xl font-bold mb-6">
          Contact Support
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {contactMethods.map((method, i) => {

            const Icon = method.icon;

            return (

              <div
                key={i}
                className="bg-white  rounded-2xl p-6 hover:shadow-xl transition"
              >

                <div className="bg-orange-100/70 p-3 rounded-lg w-fit mb-4">

                  <Icon className="text-orange-600 w-6 h-6" />

                </div>

                <h3 className="font-semibold mb-1">
                  {method.title}
                </h3>

                <p className="text-sm text-gray-700">
                  {method.contact}
                </p>

                <p className="text-xs text-gray-500">
                  {method.time}
                </p>

              </div>

            );

          })}

        </div>

      </div>


      {/* FEEDBACK */}

      <div className="bg-white  rounded-2xl p-8 text-center">

        <h3 className="text-2xl font-bold mb-2">
          Help Us Improve
        </h3>

        <p className="text-gray-600 mb-6">
          Share your feedback and suggestions.
        </p>

        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-sm">

          Send Feedback

        </button>

      </div>

    </div>
  );
}