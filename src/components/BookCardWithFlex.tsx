
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

type BookDetails = {
  id: string;
  title: string;
  availableFor: string[];
  bookImg: string;
  description?: string;
  author: string;
  price: number | undefined;

}
const BookCardWithFlex = (props: BookDetails) => {
  const t = useTranslations('ShopPage');
  return (
    <>
    <Link href={`/shop/${props.id}`} style={{position: 'relative'}} className="bg-card-bg border rounded-lg flex shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className='flex flex-1 w-full h-full'>
        <Image width={1000} height={1000} src={props.bookImg} alt={props.title} className="object-cover rounded-l" />
      </div>
      <div className="p-6 flex-1">
        <h3 className="text-xl font-bold primary-color mb-1">{props.title}</h3>
        <p className="text-gray-600 mb-2">{props.author}</p>
        <p className="text-gray-700 mb-4">{props.description}</p>
        <div className="flex justify-between items-center">
        {props.availableFor.includes('sell') ? (
            <p className="mt-1 text-lg font-semibold primary-color">E£{props.price?.toFixed(2)}</p>
          ) : (<p className="mt-1 text-lg pt-7 font-semibold primary-color"></p>)}
          <div style={{ position: 'absolute'}} className='top-5 left-3'>
            {props.availableFor.includes('sell') && (
              <span className="bg-primary-color mx-1 font-bold text-gray-50 px-4 py-2.5 rounded-full text-sm lg:text-md">
                {t('forSale')}
              </span>
            )}
            {props.availableFor.includes('swap') && (
              <span className="bg-primary-color mx-1 font-bold text-gray-50 px-4 py-2.5 rounded-full text-sm lg:text-md">
                {t('forExchange')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
    </>
  )
} 

export default BookCardWithFlex