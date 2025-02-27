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
        <div className="p-6 max-w-6xl mx-auto relative">
            <Title level={3} className="mb-4">Featured Artworks</Title>
            {featuredArtworks.length > 0 ? (
                <div className="relative flex items-center justify-center">
                    {/* Outer container for keeping arrows separate */}
                    <div className="relative w-full">
                        {/* Inner container for artworks */}
                        <div className="relative mx-auto max-w-4xl">
                            <Swiper
                                modules={[EffectCoverflow, Navigation, Pagination]}
                                effect="coverflow"
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={3}
                                initialSlide={3}
                                spaceBetween={5}
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 200,
                                    modifier: 2.5,
                                    slideShadows: false,
                                }}
                                navigation={{
                                    prevEl: ".custom-prev",
                                    nextEl: ".custom-next",
                                }}
                                pagination={{ clickable: true }}
                                breakpoints={{
                                    320: { slidesPerView: 1, spaceBetween: 5 },
                                    768: { slidesPerView: 2, spaceBetween: 10 },
                                    1024: { slidesPerView: 3, spaceBetween: 10 },
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
                        </div>

                        {/* Custom navigation arrows, now fully outside artworks */}
                        <div className="custom-prev"></div>
                        <div className="custom-next"></div>
                    </div>
                </div>
            ) : (
                <Empty description="No featured artworks available" />
            )}
        </div>
    );
};

export default FeaturedArtworks;
