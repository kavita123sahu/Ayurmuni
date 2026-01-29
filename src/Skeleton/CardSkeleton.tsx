// import { View } from "react-native";
// import SkeletonPlaceholder from "react-native-skeleton-placeholder";

// // ------------------ Doctor Card Skeleton ------------------
// export const DoctorCardSkeleton = () => {
//   return (
//     <View
//       style={{
//         backgroundColor: "#E8E8E8",
//         borderRadius: 12,
//         padding: 16,
//         marginBottom: 12,
//         borderWidth: 1,
//         borderColor: "#E8E8E8",
//       }}
//     >
//       <SkeletonPlaceholder>
//         <SkeletonPlaceholder.Item
//           flexDirection="row"
//           padding={12}
//           marginBottom={16}
//           borderRadius={12}
//         >
//           {/* Avatar + Details */}
//           <SkeletonPlaceholder.Item flexDirection="row">
//             <SkeletonPlaceholder.Item>
//               <SkeletonPlaceholder.Item
//                 width={60}
//                 height={60}
//                 borderRadius={30}
//               />
//             </SkeletonPlaceholder.Item>

//             <SkeletonPlaceholder.Item marginLeft={12}>
//               <SkeletonPlaceholder.Item width={140} height={18} marginBottom={6} />
//               <SkeletonPlaceholder.Item width={100} height={14} marginBottom={6} />
//               <SkeletonPlaceholder.Item width={160} height={14} marginBottom={6} />
//               <SkeletonPlaceholder.Item width={180} height={14} />
//             </SkeletonPlaceholder.Item>
//           </SkeletonPlaceholder.Item>
//         </SkeletonPlaceholder.Item>

//         {/* Divider */}
//         <SkeletonPlaceholder.Item width="100%" height={1} marginBottom={16} />

//         {/* Rating Section */}
//         <SkeletonPlaceholder.Item paddingHorizontal={12}>
//           <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between">
//             <SkeletonPlaceholder.Item width={80} height={40} borderRadius={10} />
//             <SkeletonPlaceholder.Item width={80} height={40} borderRadius={10} />
//           </SkeletonPlaceholder.Item>

//           <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" marginTop={10}>
//             <SkeletonPlaceholder.Item width={120} height={14} />
//             <SkeletonPlaceholder.Item width={120} height={14} />
//           </SkeletonPlaceholder.Item>
//         </SkeletonPlaceholder.Item>

//         {/* Divider */}
//         <SkeletonPlaceholder.Item width="100%" height={1} marginVertical={16} />

//         {/* Bottom Fee & Button Section */}
//         <SkeletonPlaceholder.Item
//           paddingHorizontal={12}
//           flexDirection="row"
//           justifyContent="space-between"
//           alignItems="center"
//         >
//           <SkeletonPlaceholder.Item>
//             <SkeletonPlaceholder.Item width={120} height={14} marginBottom={6} />
//             <SkeletonPlaceholder.Item width={80} height={16} />
//           </SkeletonPlaceholder.Item>

//           <SkeletonPlaceholder.Item>
//             <SkeletonPlaceholder.Item width={90} height={18} marginBottom={6} />
//             <SkeletonPlaceholder.Item width={120} height={38} borderRadius={12} />
//           </SkeletonPlaceholder.Item>
//         </SkeletonPlaceholder.Item>
//       </SkeletonPlaceholder>
//     </View>
//   );
// };

// // ------------------ Product Skeleton ------------------
// export const ProductSkeleton = () => (
//   <SkeletonPlaceholder>
//     <SkeletonPlaceholder.Item marginBottom={25}>
//       {/* Section Title */}
//       <SkeletonPlaceholder.Item width={180} height={18} marginBottom={12} />

//       {/* Horizontal Items */}
//       <SkeletonPlaceholder.Item flexDirection="row" gap={12}>
//         {[1, 2, 3].map(i => (
//           <SkeletonPlaceholder.Item >
//             {/* Image */}
//             <SkeletonPlaceholder.Item width={150} height={150} borderRadius={12} />

//             {/* Title line */}
//             <SkeletonPlaceholder.Item width={120} height={12} marginTop={10} />

//             {/* Subtitle line */}
//             <SkeletonPlaceholder.Item width={80} height={12} marginTop={6} />
//           </SkeletonPlaceholder.Item>
//         ))}
//       </SkeletonPlaceholder.Item>
//     </SkeletonPlaceholder.Item>
//   </SkeletonPlaceholder>
// );

// // ------------------ Category Skeleton ------------------
// export const CategorySkeleton = () => (
//   <SkeletonPlaceholder>
//     <SkeletonPlaceholder.Item marginBottom={25}>
//       {/* Header / Title */}
//       <SkeletonPlaceholder.Item width={150} height={18} marginBottom={15} />

//       {/* Row of 4 items */}
//       <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" alignItems="center">
//         {[1, 2, 3, 4].map(i => (
//           <SkeletonPlaceholder.Item alignItems="center">
//             {/* Circle icon placeholder */}
//             <SkeletonPlaceholder.Item width={60} height={60} borderRadius={30} />

//             {/* Label placeholder */}
//             <SkeletonPlaceholder.Item width={50} height={12} marginTop={8} />
//           </SkeletonPlaceholder.Item>
//         ))}
//       </SkeletonPlaceholder.Item>
//     </SkeletonPlaceholder.Item>
//   </SkeletonPlaceholder>
// );

// // ------------------ Empty Card Order List Placeholder ------------------
// export const CardOrderList = () => <></>;

import { Dimensions, View } from "react-native";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'



const SCREEN_HEIGHT = Dimensions.get('window').height;
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 50) / 2;
const SKELETON_BG = '#EEF2F7';
const SKELETON_HIGHLIGHT = '#FAFCFF';

// ------------------ Doctor Card Skeleton ------------------


export const DoctorCardSkeleton = () => {
  return (
    <View
      style={{
        backgroundColor: SKELETON_BG,
        borderRadius: 20,
        padding: 5,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E3E8EF',
      }}
    >

      <SkeletonPlaceholder
        backgroundColor={SKELETON_BG}
        highlightColor={SKELETON_HIGHLIGHT}
        speed={1200}
      >
        {/* ===== TOP SECTION ===== */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          marginBottom={16}
        >
          {/* Avatar */}
          <SkeletonPlaceholder.Item
            width={64}
            height={64}
            borderRadius={32}
          />

          {/* Doctor Info */}
          <SkeletonPlaceholder.Item marginLeft={12} flex={1}>
            <SkeletonPlaceholder.Item
              width="70%"
              height={16}
              borderRadius={6}
              marginBottom={6}
            />
            <SkeletonPlaceholder.Item
              width="55%"
              height={13}
              borderRadius={6}
              marginBottom={6}
            />
            <SkeletonPlaceholder.Item
              width="65%"
              height={13}
              borderRadius={6}
              marginBottom={6}
            />
            <SkeletonPlaceholder.Item
              width="85%"
              height={13}
              borderRadius={6}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>

        {/* ===== DIVIDER ===== */}
        <SkeletonPlaceholder.Item
          height={1}
          width="100%"
          marginBottom={16}
          borderRadius={1}
        />

        {/* ===== RATING BUTTONS ===== */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          marginBottom={10}
        >
          <SkeletonPlaceholder.Item
            width="45%"
            height={40}
            borderRadius={12}
          />
          <SkeletonPlaceholder.Item
            width="45%"
            height={40}
            borderRadius={12}
          />
        </SkeletonPlaceholder.Item>

        {/* Rating Text */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          marginBottom={16}>
          <SkeletonPlaceholder.Item width="40%" height={12} />
          <SkeletonPlaceholder.Item width="40%" height={12} />
        </SkeletonPlaceholder.Item>

        {/* ===== DIVIDER ===== */}
        <SkeletonPlaceholder.Item
          height={1}
          width="100%"
          marginBottom={16}
          borderRadius={1}
        />

        {/* ===== BOTTOM SECTION ===== */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Fee */}
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              width={110}
              height={12}
              marginBottom={6}
            />
            <SkeletonPlaceholder.Item
              width={80}
              height={16}
            />
          </SkeletonPlaceholder.Item>

          {/* Availability + Button */}
          <SkeletonPlaceholder.Item alignItems="flex-end">
            <SkeletonPlaceholder.Item
              width={100}
              height={12}
              marginBottom={6}
            />
            <SkeletonPlaceholder.Item
              width={120}
              height={38}
              borderRadius={14}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};


// ------------------ Product Skeleton ------------------

export const ProductSkeleton = () => (
  <View style={{ paddingHorizontal: 16, backgroundColor: '#FFFFFF' }}>
    <SkeletonPlaceholder
      backgroundColor="#E1E9EE"
      highlightColor="#FAFCFF"
    >
      <SkeletonPlaceholder.Item
        width={130}
        height={20}
        borderRadius={5}
        marginBottom={16}
      />

      {/* GRID — WRAP WITH VIEW (IMPORTANT) */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        {[1, 2, 3, 4].map(i => (
          <SkeletonPlaceholder.Item
            key={i}
            width={CARD_WIDTH}
            height={CARD_WIDTH + 40}
            marginBottom={20}
          >
            <SkeletonPlaceholder.Item
              width={CARD_WIDTH}
              height={CARD_WIDTH}
              borderRadius={16}
            />
            <SkeletonPlaceholder.Item
              width={CARD_WIDTH * 0.7}
              height={12}
              marginTop={10}
            />
            <SkeletonPlaceholder.Item
              width={CARD_WIDTH * 0.5}
              height={10}
              marginTop={6}
            />
          </SkeletonPlaceholder.Item>
        ))}
      </View>
    </SkeletonPlaceholder>
  </View>
);


// export const ProductSkeleton = () => (
//   <View style={{ flex: 1, paddingHorizontal: 16, backgroundColor: '#FFFFFF' }}>
//     <SkeletonPlaceholder
//       backgroundColor={SKELETON_BG}
//       highlightColor={SKELETON_HIGHLIGHT}
//     >
//       {/* WHITE CANVAS FIX */}
//       <SkeletonPlaceholder.Item
//         width="100%"
//         height="100%"
//         backgroundColor="#FFFFFF"
//       />

//       <SkeletonPlaceholder.Item
//         width={130}
//         height={20}
//         borderRadius={5}
//         marginBottom={16}
//       />

//       <SkeletonPlaceholder.Item
//         flexDirection="row"
//         flexWrap="wrap"
//         justifyContent="space-between"
//       >
//         {[1, 2, 3, 4].map(i => (
//           <SkeletonPlaceholder.Item
//             key={i}
//             width={CARD_WIDTH}
//             marginBottom={20}
//           >
//             <SkeletonPlaceholder.Item
//               width={CARD_WIDTH}
//               height={CARD_WIDTH}
//               borderRadius={16}
//             />
//             <SkeletonPlaceholder.Item
//               width="70%"
//               height={12}
//               borderRadius={6}
//               marginTop={10}
//             />
//             <SkeletonPlaceholder.Item
//               width="50%"
//               height={10}
//               borderRadius={6}
//               marginTop={6}
//             />
//           </SkeletonPlaceholder.Item>
//         ))}
//       </SkeletonPlaceholder.Item>
//     </SkeletonPlaceholder>
//   </View>
// );


// ------------------ Category Skeleton ------------------

export const CategorySkeleton = () => (
  <View style={{ backgroundColor: '#FFFFFF', paddingBottom: 20 }}>
    <SkeletonPlaceholder
      backgroundColor="#E6EBF2"
      highlightColor="#F7F9FC"
    >
      <SkeletonPlaceholder.Item marginBottom={28} marginTop={20}>
        <SkeletonPlaceholder.Item
          width={160}
          height={18}
          borderRadius={6}
          marginBottom={20}
        />

        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          paddingHorizontal={4} >
          {[1, 2, 3, 4].map(i => (
            <SkeletonPlaceholder.Item key={i} alignItems="center">
              <SkeletonPlaceholder.Item
                width={60}
                height={60}
                borderRadius={30}
              />
              <SkeletonPlaceholder.Item
                width={48}
                height={12}
                borderRadius={6}
                marginTop={10}
              />
            </SkeletonPlaceholder.Item>
          ))}
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  </View>
);



