
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

interface Props {
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPriceRanges: string[];
  setSelectedPriceRanges: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ShopFilterSidebar({ selectedGenres, setSelectedGenres, selectedPriceRanges, setSelectedPriceRanges}: Props) {

  const handleGenreChange = (genre: string) => {
    setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
  };

  const handlePriceChange = (price: string) => {
    setSelectedPriceRanges(prev =>
      prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price]
    );
  };
  
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-4 text-center">Filters</h3>
      <div className="space-y-6">
        {/* Genre Filter */}
        <div>
          <h4 className="font-semibold mb-2">Genres</h4>
          {genreOptions.map((genre) => (
            <label key={genre} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenreChange(genre)}
              />
              {genre}
            </label>
          ))}
        </div>

        {/* Price Filter */}
        <div>
          <h4 className="font-semibold mb-2">Price Range</h4>
          {priceOptions.map(({ label, value }) => (
            <label key={value} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedPriceRanges.includes(value)}
                onChange={() => handlePriceChange(value)}
              />
              {label}
            </label>
          ))}
        </div>
        {/* sell & exchange Filter */}
        {/* <div>
          <h4 className="font-semibold mb-2">Avilable for</h4>
          {priceOptions.map(({ label, value }) => (
            <label key={value} className="block text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedAvilable.includes(value)}
                onChange={() => handleAvilableChange(value)}
              />
              {label}
            </label>
          ))}
        </div> */}
      </div>
    </div>
  );
}
