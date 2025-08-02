
import Image from "next/image";
import Link from "next/link";
import React from "react";

type BookDetails = {
  id: string;
  title: string;
  bookImg: string;
  availableFor: string[];
  description?: string;
  author: string;
  price: number | undefined; 
};

const BookCard = (props: BookDetails) => {
  return (
    <Link href={`/shop/${props.id}`} style={{position: 'relative'}} className="bg-card-color rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
      <Image width={600} height={600} src={props.bookImg} alt={props.title} className="w-full h-[250px] object-cover rounded-t mb-3" />
      <div className="p-6">
        <h3 className="text-lg font-bold primary-color mb-1">{ props.title.length >= 25 ? `${props.title.slice(0,25)}...` : `${props.title}` }</h3>
        <p className="text-gray-600 mb-4">{props.author}</p>
        <div className="flex justify-between items-center">
          {props.availableFor.includes('sell') ? (
            <p className="mt-1 text-lg font-semibold primary-color">${props.price?.toFixed(2)}</p>
          ) : (<p className="mt-1 text-lg pt-7 font-semibold primary-color"></p>)}
          <div style={{ position: 'absolute'}} className='top-2 mt-4 '>
            {props.availableFor.includes('sell') && (
              <span className="bg-primary-color mr-3 text-gray-50 px-5 py-2.5 rounded-full text-md">
                Sale
              </span>
            )}
            {props.availableFor.includes('swap') && (
              <span className="bg-primary-color mr-3 text-gray-50 px-5 py-2.5 rounded-full text-md">
                Exchange
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}; 

export default BookCard;
