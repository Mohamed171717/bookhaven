
'use client';
import { useRouter, usePathname } from 'next/navigation';

type Lang = 'en' | 'ar';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

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
  };

  return (
    <div className="flex ml-10">
      <div className="flex gap-[2px] justify-center items-center">
        <div dir='ltr'>
          <div onClick={() => changeLanguage('en')} 
            className={`py-1.5 px-4 flex items-center hover:bg-[#4A4947] transition justify-center rounded-s-lg ${currentLocale === 'en' ? 'bg-[#4A4947]' : 'bg-btn-color'} cursor-pointer`}>
            <p className="text-white text-sm font-medium">EN</p>
          </div>
        </div>
        <div dir='rtl'>
          <div onClick={() => changeLanguage('ar')} 
            className={`py-1.5 px-4 flex items-center hover:bg-[#4A4947] transition justify-center rounded-s-lg ${currentLocale === 'ar' ? 'bg-[#4A4947]' : 'bg-btn-color'} cursor-pointer`}>
            <p className="text-white text-sm font-medium">AR</p>
          </div>
        </div>
      </div>
    </div>
  );
}