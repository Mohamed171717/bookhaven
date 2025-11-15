
'use client';

import { useTranslations } from "next-intl";

interface Props {
  selectedGenres: string[];
  selectedAvilable: string[];
  selectedPriceRanges: string[];
  selectedCondition: string[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedAvilable: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedPriceRanges: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedCondition: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ShopFilterSidebar(
  { selectedGenres, 
    selectedPriceRanges,
    selectedAvilable,
    selectedCondition,
    setSelectedCondition,
    setSelectedAvilable, 
    setSelectedGenres, 
    setSelectedPriceRanges
  }: Props) {

  const t = useTranslations('ShopPage');

  const genreOptions = [
    { label: t('fiction'), value: 'Fiction' },
    { label: t('fantasy'), value: 'Fantasy' },
    { label: t('science fiction'), value: 'Science Fiction' },
    { label: t('mystery & thriller'), value: 'Mystery & Thriller' },
    { label: t('romance'), value: 'Romance' },
    { label: t('historical'), value: 'Historical' },
    { label: t('young adult'), value: 'Young Adult' },
    { label: t('horror'), value: 'Horror' },
    { label: t('biography'), value: 'Biography' },
    { label: t('personal growth'), value: 'Personal Growth' },
  ];

  const availableOptions = [
    { label: t('sell'), value: 'sell' },
    { label: t('exchange'), value: 'swap' },
  ];

  const conditions = [
    { label: t('new'), value: 'new' },
    { label: t('used'), value: 'used' },
  ];

  const priceOptions = [
    { label: t('untill'), value: '0-50' },
    { label: '50 EGP - 100 EGP', value: '50-100' },
    { label: '100 EGP - 150 EGP', value: '100-150' },
    { label: '150 EGP - 200 EGP', value: '150-200' },
    { label: t('moreThan'), value: '200-200000' },
  ];


  // handle genre change
  const handleGenreChange = (genre: string) => {
    setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
  };

  // handle price change
  const handlePriceChange = (price: string) => {
    setSelectedPriceRanges(prev =>
      prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price]
    );
  };

  // handle available change
  const handleAvilableChange = (avilable: string) => {
    setSelectedAvilable(prev =>
      prev.includes(avilable) ? prev.filter(a => a !== avilable) : [...prev, avilable]
    );
  };

  // handle condition change
  const handleConditionChange = (condition: string) => {
    setSelectedCondition(prev =>
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    );
  };

  
  return (
    <div className="p-4 bg-card-bg border rounded-2xl shadow-xl">
      <div className="space-y-6 bg-card-bg">
        {/* Genre Filter */}
        <div>
          <h4 className="font-semibold text-md mb-2">{t('genres')}</h4>
          {genreOptions.map(({label, value}) => (
            <label key={value} className="block text-md mb-1">
              <input
                type="checkbox"
                className='appearance-none mx-2 mb-[-2px] w-4 h-4 border-2 border-gray-500 rounded-sm checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none'
                checked={selectedGenres.includes(value)}
                onChange={() => handleGenreChange(value)}
              />
              {label}
            </label>
          ))}
        </div>

        {/* Price Filter */}
        <div>
          <h4 className="font-semibold text-md mb-2">{t('price')}</h4>
          {priceOptions.map(({ label, value }) => (
            <label key={value} className="block text-md mb-1">
              <input
                type="checkbox"
                className='appearance-none mx-2 mb-[-2px] w-4 h-4 border-2 border-gray-500 rounded-sm checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none'
                checked={selectedPriceRanges.includes(value)}
                onChange={() => handlePriceChange(value)}
              />
              {label}
            </label>
          ))}
        </div>
        {/* available Filter */}
        <div>
          <h4 className="font-semibold text-md mb-2">{t('avilable')}</h4>
          {availableOptions.map(({ label, value }) => (
            <label key={value} className="block text-md">
              <input
                type="checkbox"
                className="appearance-none mx-2 mb-[-2px] w-4 h-4 border-2 border-gray-500 rounded-sm checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none"
                checked={selectedAvilable.includes(value)}
                onChange={() => handleAvilableChange(value)}
              />
              {label}
            </label>
          ))}
        </div>
        {/* conditions Filter */}
        <div>
          <h4 className="font-semibold text-md mb-2">{t('conditions')}</h4>
          {conditions.map(({ label, value }) => (
            <label key={value} className="block text-md">
              <input
                type="checkbox"
                className="appearance-none mx-2 mb-[-2px] w-4 h-4 border-2 border-gray-500 rounded-sm checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none"
                checked={selectedCondition.includes(value)}
                onChange={() => handleConditionChange(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
