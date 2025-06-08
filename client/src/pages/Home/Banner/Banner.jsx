/* eslint-disable react/prop-types */
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Banner.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import samsung from "../../../assets/images/Banners/samsung.jpeg";
import newo from '../../../assets/images/Banners/newo.jpg';
import newt from "../../../assets/images/Banners/newt.jpg";
import laptop from "../../../assets/images/Banners/laptop.png";
import mattress from "../../../assets/images/Banners/mattress.jpg";
import iphone from "../../../assets/images/Banners/iphone.jpg";

export const PreviousBtn = ({ className, onClick }) => {
    return (
        <div className={`${className} !z-10 w-2 h-2 flex items-center justify-center bg-white rounded-full shadow`} onClick={onClick}>
            <ArrowBackIosIcon fontSize="small" className="text-gray-700"/>
        </div>
    );
};

export const NextBtn = ({ className, onClick }) => {
    return (
        <div className={`${className} !z-10 w-2 h-2 flex items-center justify-center bg-white rounded-full shadow`} onClick={onClick}>
            <ArrowForwardIosIcon fontSize="small" className="text-gray-700"/>
        </div>
    );
};

const Banner = () => {
    const settings = {
        autoplay: true,
        autoplaySpeed: 3000,
        dots: false,
        infinite: true,
        speed: 1500,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: <PreviousBtn />,
        nextArrow: <NextBtn />,
    };

    const banners = [
        iphone,
        laptop,
        newo,
        samsung,
        mattress,
        newt,
    ];

    return (
        <>
            <section className="w-full rounded-sm shadow p-0 overflow-hidden mt-3 sm:m-2">
                <Slider {...settings}>
                    {banners.map((el, i) => (
                        <img
                            draggable="false"
                            className="h-[150px] sm:h-[280px] w-full object-cover "
                            src={el}
                            alt="banner"
                            key={i}
                        />
                    ))}
                </Slider>
            </section>
        </>
    );
};

export default Banner;
