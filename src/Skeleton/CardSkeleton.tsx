import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

// ------------------ Doctor Card Skeleton ------------------
export const DoctorCardSkeleton = () => {
  return (
    <View
      style={{
        backgroundColor: "#E8E8E8",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E8E8E8",
      }}
    >
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          padding={12}
          marginBottom={16}
          borderRadius={12}
        >
          {/* Avatar + Details */}
          <SkeletonPlaceholder.Item flexDirection="row">
            <SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={60}
                height={60}
                borderRadius={30}
              />
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item marginLeft={12}>
              <SkeletonPlaceholder.Item width={140} height={18} marginBottom={6} />
              <SkeletonPlaceholder.Item width={100} height={14} marginBottom={6} />
              <SkeletonPlaceholder.Item width={160} height={14} marginBottom={6} />
              <SkeletonPlaceholder.Item width={180} height={14} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>

        {/* Divider */}
        <SkeletonPlaceholder.Item width="100%" height={1} marginBottom={16} />

        {/* Rating Section */}
        <SkeletonPlaceholder.Item paddingHorizontal={12}>
          <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between">
            <SkeletonPlaceholder.Item width={80} height={40} borderRadius={10} />
            <SkeletonPlaceholder.Item width={80} height={40} borderRadius={10} />
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" marginTop={10}>
            <SkeletonPlaceholder.Item width={120} height={14} />
            <SkeletonPlaceholder.Item width={120} height={14} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>

        {/* Divider */}
        <SkeletonPlaceholder.Item width="100%" height={1} marginVertical={16} />

        {/* Bottom Fee & Button Section */}
        <SkeletonPlaceholder.Item
          paddingHorizontal={12}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item width={120} height={14} marginBottom={6} />
            <SkeletonPlaceholder.Item width={80} height={16} />
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item width={90} height={18} marginBottom={6} />
            <SkeletonPlaceholder.Item width={120} height={38} borderRadius={12} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

// ------------------ Product Skeleton ------------------
export const ProductSkeleton = () => (
  <SkeletonPlaceholder>
    <SkeletonPlaceholder.Item marginBottom={25}>
      {/* Section Title */}
      <SkeletonPlaceholder.Item width={180} height={18} marginBottom={12} />

      {/* Horizontal Items */}
      <SkeletonPlaceholder.Item flexDirection="row" gap={12}>
        {[1, 2, 3].map(i => (
          <SkeletonPlaceholder.Item >
            {/* Image */}
            <SkeletonPlaceholder.Item width={150} height={150} borderRadius={12} />

            {/* Title line */}
            <SkeletonPlaceholder.Item width={120} height={12} marginTop={10} />

            {/* Subtitle line */}
            <SkeletonPlaceholder.Item width={80} height={12} marginTop={6} />
          </SkeletonPlaceholder.Item>
        ))}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder.Item>
  </SkeletonPlaceholder>
);

// ------------------ Category Skeleton ------------------
export const CategorySkeleton = () => (
  <SkeletonPlaceholder>
    <SkeletonPlaceholder.Item marginBottom={25}>
      {/* Header / Title */}
      <SkeletonPlaceholder.Item width={150} height={18} marginBottom={15} />

      {/* Row of 4 items */}
      <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" alignItems="center">
        {[1, 2, 3, 4].map(i => (
          <SkeletonPlaceholder.Item alignItems="center">
            {/* Circle icon placeholder */}
            <SkeletonPlaceholder.Item width={60} height={60} borderRadius={30} />

            {/* Label placeholder */}
            <SkeletonPlaceholder.Item width={50} height={12} marginTop={8} />
          </SkeletonPlaceholder.Item>
        ))}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder.Item>
  </SkeletonPlaceholder>
);

// ------------------ Empty Card Order List Placeholder ------------------
export const CardOrderList = () => <></>;
