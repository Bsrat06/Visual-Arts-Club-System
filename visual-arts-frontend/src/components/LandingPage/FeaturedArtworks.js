import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFeaturedArtworks } from "../../redux/slices/artworkSlice";
import { Image, Skeleton, Typography, Empty, Avatar } from "antd";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { LeftOutlined, RightOutlined } from "@ant-design/icons"; // Import icons
import "../../styles/featured-artworks.css";

const { Title, Text } = Typography;

const FeaturedArtworks = () => {
    const dispatch = useDispatch();
    const { featuredArtworks, loading, error } = useSelector((state) => state.artwork);

    useEffect(() => {
        dispatch(fetchFeaturedArtworks());
    }, [dispatch]);

    if (loading) return <Skeleton active />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6 max-w-screen-xl mx-auto relative">
            {/* Title */}
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
                Featured Artworks
            </h2>
            {featuredArtworks.length > 0 ? (
                <div className="relative flex items-center justify-center">
                    {/* Arrows (Positioned Relative to the Artworks) */}
                    <button className="custom-prev">
                        <LeftOutlined />
                    </button>

                    {/* Artwork Swiper Container */}
                    <div className="relative mx-auto max-w-4xl w-full">
                        <Swiper
                            modules={[EffectCoverflow, Navigation, Pagination]}
                            effect="coverflow"
                            grabCursor={true}
                            centeredSlides={true} // Ensure slides are centered
                            slidesPerView={3} // Show 3 slides (1 center + 2 partial sides)
                            initialSlide={1}
                            spaceBetween={10}
                            coverflowEffect={{
                                rotate: 0,
                                stretch: 0,
                                depth: 100,
                                modifier: 2.5,
                                slideShadows: false,
                            }}
                            navigation={{
                                prevEl: ".custom-prev",
                                nextEl: ".custom-next",
                            }}
                            pagination={{ 
                                clickable: true,
                                el: ".swiper-pagination", // Use a custom class for pagination
                                dynamicBullets: true, // Enable dynamic bullets for better visibility
                            }}
                            breakpoints={{
                                320: { 
                                    slidesPerView: 3, // Show 3 slides on small screens
                                    spaceBetween: 10, // Adjust spacing for small screens
                                    coverflowEffect: {
                                        rotate: 0,
                                        stretch: 0,
                                        depth: 100,
                                        modifier: 2.5,
                                        slideShadows: false,
                                    },
                                },
                                640: { slidesPerView: 3, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 30 },
                            }}
                        >
                            {featuredArtworks.map((art) => (
                                <SwiperSlide key={art.id} className="swiper-slide-custom">
                                    <div className="relative">
                                        <Link to={`/artwork/${art.id}`}>
                                            <Image
                                                src={art.image}
                                                alt={art.title}
                                                className="rounded-lg object-cover"
                                                style={{ height: "300px", width: "100%" }}
                                                preview={false}
                                            />
                                        </Link>
                                        {/* Artist Avatar and Name */}
                                        <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 p-2 flex items-center w-fit rounded-bl-lg rounded-tr-lg">
                                            <Avatar src={art.artist_avatar} size="small" className="mr-2" />
                                            <Text className="text-white">{art.artist_name}</Text>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom Pagination Container */}
                        <div className="swiper-pagination"></div>
                    </div>

                    {/* Right Arrow */}
                    <button className="custom-next">
                        <RightOutlined />
                    </button>
                </div>
            ) : (
                <Empty description="No featured artworks available" />
            )}
        </div>
    );
};

export default FeaturedArtworks;