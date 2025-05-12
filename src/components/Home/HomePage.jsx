import Content from "./Content";
import Reviews from "./Reviews";
import Header from "../Header";
import Footer from "../Footer";
import ImageSlider from "./ImageSlider";
import DeliveryInfo from "./DeliveryInfo";
import Statistics from "./statistics";
import News from "./News";

const HomePage = () => {
  return (
    <div className="w-full">
      <div className="sticky top-0 z-40">
        <Header />
      </div>
      <div className="mt-16">
        <ImageSlider />
      </div>
      <div className="w-full">
          <DeliveryInfo />
          <Content />
          <Statistics />
          <News />
          <Reviews />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
