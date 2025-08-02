
'use client';

const genreOptions = [
  'Fiction', 'Fantasy', 'Science Fiction', 'Mystery & Thriller',
  'Romance', 'Historical', 'Young Adult', 'Horror',
  'Biography', 'Personal Growth',
];

const priceOptions = [
  { label: '$0 - $50', value: '0-50' },
  { label: '$50 - $100', value: '50-100' },
  { label: '$100 - $150', value: '100-150' },
  { label: '$150 - $200', value: '150-200' },
];

const availableOptions = [
  { label: 'Sell', value: 'sell' },
  { label: 'Exchange', value: 'swap' },
];

const conditions = [
  { label: 'New', value: 'new' },
  { label: 'Used', value: 'used' },
];


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
    <div className="p-4 bg-gray-150 rounded-2xl shadow-xl">
      <div className="space-y-6 ">
        {/* Genre Filter */}
        <div>
          <h4 className="font-semibold text-md mb-2">Genres</h4>
          {genreOptions.map((genre) => (
            <label key={genre} className="block text-md mb-1">
              <input
                type="checkbox"
                className='appearance-none mr-2 mb-[-2px] w-4 h-4 border-2 border-gray-500 rounded-sm checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none'
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenreChange(genre)}
              />
              {genre}
            </label>
          ))}
        </div>

        {/* Price Filter */}
        <div>
          <h4 className="font-semibold text-md mb-2">Price Range</h4>
          {priceOptions.map(({ label, value }) => (
            <label key={value} className="block text-md mb-1">
              <input
                type="checkbox"
                className='appearance-none mr-2 mb-[-2px] w-4 h-4 border-2 border-gray-500 rounded-sm checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none'
                checked={selectedPriceRanges.includes(value)}
                onChange={() => handlePriceChange(value)}
              />
              {label}
            </label>
          ))}
        </div>
        {/* available Filter */}
        <div>
          <h4 className="font-semibold text-md mb-2">Avilable for</h4>
          {availableOptions.map(({ label, value }) => (
            <label key={value} className="block text-md">
              <input
                type="checkbox"
                className="appearance-none mr-2 mb-[-2px] w-4 h-4 border-2 border-gray-500 rounded-sm checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none"
                checked={selectedAvilable.includes(value)}
                onChange={() => handleAvilableChange(value)}
              />
              {label}
            </label>
          ))}
        </div>
        {/* conditions Filter */}
        <div>
          <h4 className="font-semibold text-md mb-2">Conditions</h4>
          {conditions.map(({ label, value }) => (
            <label key={value} className="block text-md">
              <input
                type="checkbox"
                className="appearance-none mr-2 mb-[-2px] w-4 h-4 border-2 border-gray-500 rounded-sm checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none"
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
