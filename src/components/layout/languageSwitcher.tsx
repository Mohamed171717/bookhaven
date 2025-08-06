
'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IoLanguage } from 'react-icons/io5';

type Lang = 'en' | 'ar';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // language 
  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = ['en', 'ar'].includes(segments[0]) ? segments[0] as Lang : 'en';

  const changeLanguage = (lng: Lang) => {
    const newSegments = [...segments];
    if (['en', 'ar'].includes(newSegments[0])) {
      newSegments[0] = lng;
    } else {
      newSegments.unshift(lng);
    }
    const newPath = `/${newSegments.join('/')}`;
    router.push(newPath);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <>
      {/* Language Switcher */}
      <div className="relative rounded bg-card-bg border" ref={languageRef}>
        <button
          onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
          className="flex items-center gap-2 px-3 pt-2 pb-[0.7rem] rounded-lg hover:bg-gray-100 transition-colors"
        >
          <IoLanguage className="text-lg text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {currentLocale === 'en' ? 'EN' : 'AR'}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Language Dropdown */}
        {isLanguageDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
            <div>
              <button
                onClick={() => changeLanguage('en')}
                className={`w-full px-4 py-2 text-left rounded-t-lg hover:bg-gray-100 flex items-center gap-2 ${
                  currentLocale === 'en' ? 'bg-gray-100 text-primary-color' : 'text-gray-700'
                }`}
              >
                <span className="text-sm">English</span>
              </button>
              <button
                onClick={() => changeLanguage('ar')}
                className={`w-full px-4 py-2 text-left rounded-b-lg hover:bg-gray-100 flex items-center gap-2 ${
                  currentLocale === 'ar' ? 'bg-gray-100 text-primary-color' : 'text-gray-700'
                }`}
              >
                <span className="text-sm">العربية</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}



export function AbsoluteLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // language 
  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = ['en', 'ar'].includes(segments[0]) ? segments[0] as Lang : 'en';

  const changeLanguage = (lng: Lang) => {
    const newSegments = [...segments];
    if (['en', 'ar'].includes(newSegments[0])) {
      newSegments[0] = lng;
    } else {
      newSegments.unshift(lng);
    }
    const newPath = `/${newSegments.join('/')}`;
    router.push(newPath);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <>
      {/* Language Switcher */}
      <div className="absolute top-10 left-16 rounded bg-card-bg border" ref={languageRef}>
        <button
          onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <IoLanguage className="text-lg text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {currentLocale === 'en' ? 'EN' : 'AR'}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Language Dropdown */}
        {isLanguageDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
            <div>
              <button
                onClick={() => changeLanguage('en')}
                className={`w-full px-4 py-2 text-left rounded-t-lg hover:bg-gray-100 flex items-center gap-2 ${
                  currentLocale === 'en' ? 'bg-gray-100 text-primary-color' : 'text-gray-700'
                }`}
              >
                <span className="text-sm">English</span>
              </button>
              <button
                onClick={() => changeLanguage('ar')}
                className={`w-full px-4 py-2 text-left rounded-b-lg hover:bg-gray-100 flex items-center gap-2 ${
                  currentLocale === 'ar' ? 'bg-gray-100 text-primary-color' : 'text-gray-700'
                }`}
              >
                <span className="text-sm">العربية</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}