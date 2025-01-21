"use client"
import { Typewriter } from 'react-simple-typewriter';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Users, ShoppingBag, ClipboardList } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const cards = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'text-blue-600'
    },
    {
      title: 'Partners',
      icon: Users,
      path: '/partners',
      color: 'text-green-600'
    },
    {
      title: 'Orders',
      icon: ShoppingBag,
      path: '/orders',
      color: 'text-purple-600'
    },
    {
      title: 'Assignments',
      icon: ClipboardList,
      path: '/assignments',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full py-2 px-4">
      <h1 className="text-4xl font-bold text-center leading-relaxed mb-12">
        <span className="text-black">Smart Delivery for </span>
        <span className="text-blue-600">
          <Typewriter
            words={[
              'Efficient Assignments',
              'Real-Time Tracking',
              'Seamless Operations'
            ]}
            loop={true}
            cursor
            cursorStyle='|'
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={index}
              className="group hover:shadow-md transition-all  hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(card.path)}
            >
              <CardHeader className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                    <IconComponent size={48} strokeWidth={1.5} />
                  </div>
                  <CardTitle className="text-2xl font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                    {card.title}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

    </div>
  );
}