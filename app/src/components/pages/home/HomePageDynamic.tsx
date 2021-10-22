import dynamic from "next/dynamic";

const HomePageDynamic = dynamic(
  () => import("src/components/pages/home/HomePage"),
  {
    ssr: false,
  }
);

export default HomePageDynamic;
