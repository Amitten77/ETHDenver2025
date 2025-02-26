import NavBar from "./components/NavBar";

import { Tourney } from "next/font/google";

const tourney = Tourney({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="hero">
      <NavBar></NavBar>
      <div className="hero_content content_box">
        <h1 className={tourney.className + " page_title"}>EigenHealth</h1>
      </div>
    </div>
  );
}
