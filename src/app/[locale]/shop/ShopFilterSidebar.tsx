
'use client';

const genreOptions = [
  'Fiction', 'Fantasy', 'Science Fiction', 'Mystery & Thriller',
  'Romance', 'Historical', 'Young Adult', 'Horror',
  'Biography', 'Personal Growth',
];

const priceOptions = [
  { label: '0 - 50', value: '0-50' },
  { label: '50 - 100', value: '50-100' },
  { label: '100 - 150', value: '100-150' },
  { label: '150 - 200', value: '150-200' },
];

export default function ShopFilterSidebar() {

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
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
