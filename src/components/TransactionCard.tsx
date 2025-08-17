
// // import { Transaction } from "@/types/TransactionType";
// import { formatDistanceToNow } from "date-fns";
// import { ExtendedTransaction } from "@/context/TransactionContext";
// import Image from "next/image";

// type Props = {
//   transaction: ExtendedTransaction;
// };


// const TransactionCard = ({ transaction }: Props) => {
//   const {
//     bookTitle,
//     bookAuthor,
//     bookImage,
//     bookPrice,
//     swapWithBookTitle,
//     type,
//     status,
//     createdAt,
//   } = transaction;

//   const createdAtDate = createdAt instanceof Date ? createdAt : createdAt?.toDate?.() ?? new Date();

//   const getTag = () => {
//     if (status === "completed") {
//       if (type === "sell") return <Tag color="bg-rose-200">Sold</Tag>;
//       if (type === "swap") return <Tag color="bg-gray-200">Traded</Tag>;
//     }
//     if (type === "sell") return <Tag color="bg-green-100">Bought</Tag>;
//     return <Tag color="bg-orange-100">Pending</Tag>;
//   };

//   return (
//     <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border">
//       {/* Left: Book Image */}
//       <div className="flex gap-4 items-start">
//         {bookImage && (
//           <Image
//             src={bookImage}
//             alt={bookTitle!}
//             width={150}
//             height={150}
//             className="rounded-lg object-cover"
//           />
//         )}
//         {/* Middle: Details */}
//         <div>
//           <h3 className="font-semibold text-lg text-gray-900">{bookTitle}</h3>
//           <p className="text-sm text-gray-600">{bookAuthor}</p>

//           <div className="flex items-center gap-2 mt-2">
//             {getTag()}
//             <p className="text-sm text-gray-500">{formatDistanceToNow(createdAtDate)}</p>
//           </div>
//         </div>
//       </div>

//       {/* Right: Price or Swap Info */}
//       <div className="text-right">
//         {type === "swap" && swapWithBookTitle ? (
//           <p className="text-sm btn-color font-medium">
//             Traded for ``{swapWithBookTitle}``
//           </p>
//         ) : (
//           <p className="text-md btn-color font-semibold">${bookPrice?.toFixed(2)}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// const Tag = ({ children, color }: { children: React.ReactNode; color: string }) => (
//   <span className={`text-xs font-medium px-2 py-0.5 rounded ${color}`}>
//     {children}
//   </span>
// );

// export default TransactionCard;
