'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { motion } from 'framer-motion';

interface Country {
  id: number;
  name: string;
  region: string;
  title: string;
  description: string;
  imageUrl: string;
  flagColor: string;
  members: string;
  memberCount: number;
}

export default function ExplorePage() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState('All Regions');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const regions = ['All Regions', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];

  const countries: Country[] = [
    {
      id: 1,
      name: 'Vietnam',
      region: 'Asia',
      title: 'Cradle of Civilizations',
      description: 'Famed for its diverse cuisine and lush landscapes.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfRfmUSCtKK1hE5M1ZdEB4ZIDLcMxcYOaam0O9tmNWpTWeog-A2mOYWZYcLOMHbCOgGND0XakPddQSAX9SaaZyqzRsrIO9OiAGBvHdmeeCDyO0Qkzz6FRgT4kBV5QQq_2HlYSMnNgQ5CJ1bNQh1h-O8uZnvZ8ru1r4yQq-C-nvRTO8vqVEGQv8WyUFW22LobMujbXM8HK9HdwVO0DKDfDiMRQZ3vnFPIWJDYZSy9uNouS1PHF__H0a-0MbSydx8OtqHy2Cb3g6eA0',
      flagColor: 'bg-red-600',
      members: '12k',
      memberCount: 12000,
    },
    {
      id: 2,
      name: 'Japan',
      region: 'Asia',
      title: 'Tradition Meets Innovation',
      description: 'Explore the rhythm of Shinto rituals alongside cutting-edge technology.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD99LMtjE7RV2YcXwF5Hj3XUFUp6B3-qak0GgJwaTEmCKG-rVA0MsgxEw3LJUS5m9OwOXToGbjx-_VxTNIZDlM30qsRFnESHz5hzBDptE8RlJmP2gLhQ8I3WlLx5CbTnkQ1lczrTgxZ0osqtOt76rOkZbKknKCNl-1ABniDaOtmU70Gsx-7EupA-zz32DycrPbUeY9OnlL4EGPag6aXNdgvg9eDxXzZKdXg7t2LlFCh7MTfyTDqlfEBu6OMd-Sl4Pq2oYx4RyMBvvA',
      flagColor: 'bg-white border border-outline-variant',
      members: '24k',
      memberCount: 24000,
    },
    {
      id: 3,
      name: 'Brazil',
      region: 'Americas',
      title: 'Spirit of Celebration',
      description: 'Home to the Amazon and Carnival, Brazil culture is a fusion of influences.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbUZHqDaGR8i3JuPwUVdGnJ6Tm4iEXfCAFiA9TJEErI7GtUoEN6hs8KYe4Mo1Lyfzm7h99T6cgPmiGSAMLpiWkcNtInAsUosTy8hCzMHT0eBSf_Z_9SAyqOtmM-zRiZXmLFvQXUYAoY0YVWdsNtxk_VUJPmvFV-iml2q080eOfZKMLYJ6ZT7l3SibmDiYY-ue0Px9UY2XuDikI3mOSaMHIpleDG7Awr_SD00X9z0xGNaqnq52xOKMhTJBizMqtBfOeSAHSjerenI8',
      flagColor: 'bg-green-600',
      members: '18k',
      memberCount: 18000,
    },
    {
      id: 4,
      name: 'Nepal',
      region: 'Asia',
      title: 'Mountain Serenity',
      description: 'Beyond the heights of Everest lies a vibrant heart of spiritual discovery.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwvnjD918TZvg1txv73_khvYwrSu_9Hu1JWNe55Y0Yz_syi4vGWzsyvnnO8O3pAcPqoKFXjLRJ5qP8ORVw-GcW3L2KU7kPxjD-_UDOuFPwtERL4aU2xBYX3RhqubNEH6Y3-ykeuwIDouUfCRXcnIq-mku77qCcsRS8P7_RS3QIyD-Cb1kjR7f7vESb6qyK-faU94iEfV7Lxr9XjCSjaMlE2Xk8OPh2A8lt3ts4Qv5qD9yANiTD42ExpvPsvvmGai0dh710U1H9TWo',
      flagColor: 'bg-red-600',
      members: '8k',
      memberCount: 8000,
    },
    {
      id: 5,
      name: 'Italy',
      region: 'Europe',
      title: 'Artistic Renaissance',
      description: 'From the canals of Venice to the ruins of Rome.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX6caUZZo58rLBbGEr0q4gxZzCUf-RPsjAqsOB4uPz1QJ_7zckLuCVBYFGd_iFwOLEANrmrCcLv9YqMaPckPglEIVxdEjkH5pp-PeLb5XPoES_cHX_z1urWcVZkqyi58YBiFwGxPd3UHnwxxLdtSysnVRF5VylNM0C3gWlG3QIK-p3TLGU2fqhYgTboYzu0f2Dyod694s9m-l6MeyzEnZkgF9adl5HjgA7gNdp9t9g_Iy5RXko2KcflJvWUsAeCsM-Udif03zFBGo',
      flagColor: 'bg-green-600',
      members: '31k',
      memberCount: 31000,
    },
    {
      id: 6,
      name: 'Morocco',
      region: 'Africa',
      title: 'Gateway to Africa',
      description: 'Immerse yourself in the scent of spice markets.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEY47dkRvLH_b4OC7U09bnIYUYUpg_2O2mbwqcB-GfnUuxETNW3aDtwfy1PypFXhmxfih-8oNYv7-CchEEIBVJnIWDYQOB_qSHhlwi_xYcs4sW7OateVmW1Dwt--6PsKeOYS0zvXSw1oJv8VA67yuxft99UPD_L_IN7g4hqYIjC1GBnNiw16pq83wF86HiXh-1DaAvYbrzX-hzBa5mTdzBTj2FdlXxGUr__7JCvBoVx9QbnuqxmfyP-QkZEitxWRkWPcPvVGUlHsw',
      flagColor: 'bg-red-700',
      members: '15k',
      memberCount: 15000,
    },
  ];

  const filteredCountries = countries.filter(country => {
    const matchesRegion = activeRegion === 'All Regions' || country.region === activeRegion;
    const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          country.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        <aside className="hidden lg:flex flex-col p-4 gap-2 bg-surface-container-low w-64 shrink-0 h-auto self-stretch">
          <div className="px-4 py-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-[24px]">language</span>
              <h2 className="font-headline-md text-xl text-primary leading-none">Explore Culture</h2>
            </div>
            <p className="text-sm text-on-surface-variant">Discover the world's heritage</p>
          </div>
          <nav className="flex flex-col gap-1">
            {[
              { icon: 'explore', label: 'Overview' },
              { icon: 'restaurant', label: 'Food' },
              { icon: 'celebration', label: 'Festivals' },
              { icon: 'translate', label: 'Language' },
              { icon: 'history_edu', label: 'History' },
              { icon: 'palette', label: 'Art' },
            ].map((item, index) => (
              <button
                key={index}
                className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all text-sm ${
                  index === 0
                    ? 'bg-primary-container text-on-primary-container font-medium'
                    : 'text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto p-3">
            <button className="w-full bg-secondary text-on-secondary py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-sm">
              Join a Bridge Group
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bridge-pattern">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="mb-6 sm:mb-8 lg:mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface mb-1 sm:mb-2">Explore the Global Commons</h2>
              <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant max-w-2xl">
                Connect with millions of community members across the globe and discover the rich tapestries of human heritage.
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
              <div className="flex items-center bg-surface-container-low px-3 py-2 rounded-full border border-outline-variant focus-within:border-primary transition-all flex-1 max-w-full sm:max-w-md">
                <span className="material-symbols-outlined text-outline text-[20px]">search</span>
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                  placeholder="Search countries..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setActiveRegion(region)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm transition-all hover:scale-105 whitespace-nowrap ${
                      activeRegion === region
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface border border-outline-variant text-on-surface-variant hover:border-primary'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {filteredCountries.map((country, index) => (
                <motion.div
                  key={country.id}
                  className="country-card group glass-card rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="h-40 sm:h-48 overflow-hidden relative">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${country.imageUrl})` }}
                    ></div>
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2">
                      <span className={`w-4 h-3 sm:w-5 sm:h-4 rounded-sm ${country.flagColor}`}></span>
                      <span className="text-xs sm:text-sm font-medium text-on-surface">{country.name}</span>
                    </div>
                  </div>
                  <div className={`p-4 sm:p-5 flex flex-col flex-1 border-t-2 ${
                    country.region === 'Asia' ? 'border-secondary' :
                    country.region === 'Europe' ? 'border-primary' :
                    'border-tertiary-container'
                  }`}>
                    <h3 className="text-base sm:text-lg font-bold text-on-surface mb-1">{country.title}</h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant mb-4 flex-1 line-clamp-3">
                      {country.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-surface-dim overflow-hidden">
                            <img
                              className="w-full h-full object-cover"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1y0r0cZkLpmx1YpF6uJR0_7vhehmRXLE1u4KYv6XSlH1zWUtA9V7oee0VL2jdzS-JGNSv8thGfh68pSHUZcOJalvOMgGJjsdLt-dtsQrPVwotAVN5Hg6mhOt9SEZtRMEHZvwArbNes6PRNDJOoyQ83HG5k74YFjhxFAn7827vdjLrTNohkpYV11E_AUPgmyamqfzo6UHrfMG1W5Ir5oh14T-nnqQANPvoIaVRm-sZS7GX3zf-VZK0sxebLU7fNjnIjihwefbiiZw"
                              alt="Member"
                            />
                          </div>
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-surface-dim overflow-hidden">
                            <img
                              className="w-full h-full object-cover"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfbukrIpPJV6jhLEn3POBZnj1KxfUGkLeYafjDoF0u2hNRjOAua3X6j1YsdQdhv6cqQPo8tq1boLrv3GedEl-fwuFLouIk1IUmlsbiS1kku3NBKlI5vvlQIv4-RNt0bvj13x7Xsb9jDEJ24_Lz7s1qClW41pS61KCLNXVi3v1NBo0J-5_667_tyU61WkGRTUPUv4ZAXUsaINBCrqdwYNoPP1T_RBC5vMAj_X1TBs6Pd8svBJGizdL8kOErdzQ5VShvO_akYLhpa4o"
                              alt="Member"
                            />
                          </div>
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-primary text-on-primary flex items-center justify-center text-[8px] sm:text-[10px] font-bold">
                            +{country.members}
                          </div>
                        </div>
                        <span className="text-xs text-on-surface-variant">Members</span>
                      </div>
                      <Link href={`/explore/${country.name.toLowerCase()}`}>
                        <button className="text-primary hover:translate-x-1 transition-all">
                          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12">
              <button className="px-6 sm:px-8 lg:px-10 py-2.5 sm:py-3 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-on-primary transition-all shadow-sm text-sm sm:text-base">
                Discover More Destinations
              </button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
