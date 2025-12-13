import dynamic from "next/dynamic";
import HomeTop  from "./ui/HomeComponent/HomeTop";
const HomeAbout = dynamic(() => import("./ui/HomeComponent/HomeAbout"));
const HomeReviews = dynamic(() => import("./ui/HomeComponent/HomeReviews"));
const HomeCompany = dynamic(() => import("./ui/HomeComponent/HomeCompany"));


export default function Home() {
  return (
    <main className="w-full">
      <HomeTop />
      <HomeAbout />
      <HomeReviews />
      <HomeCompany />
    </main>
  );
}
