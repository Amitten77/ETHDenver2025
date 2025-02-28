import NavBar from "./components/NavBar";

import { Tourney } from "next/font/google";
import ButtonWhiteTransparent from "./components/reusables/buttons/ButtonWhiteTransparent";
import ButtonWhiteFilled from "./components/reusables/buttons/ButtonWhiteFilled";

const tourney = Tourney({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="hero">
      <NavBar></NavBar>
      <div className="hero_content content_box">
        <div className="page_header">
          <h1 className={tourney.className + " page_title"}>EigenHealth</h1>
          <h3 className={tourney.className + " page_subtitle"}>
            AVS Secured Healthcare AI Benchmarking
          </h3>
          <div className="page_header_buttons">
            <ButtonWhiteFilled path="/delegate">
              Restake your ETH
            </ButtonWhiteFilled>
            <ButtonWhiteTransparent path="/test">
              Benchmark a Model
            </ButtonWhiteTransparent>
          </div>
        </div>
      </div>
    </div>
  );
}
