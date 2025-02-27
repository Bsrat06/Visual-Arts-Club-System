import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFeaturedArtworks } from "../../redux/slices/artworkSlice";
import { Image, Card, Skeleton, Typography, Empty } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

const FeaturedArtworks = () => {
    const dispatch = useDispatch();
    const { featuredArtworks, loading, error } = useSelector((state) => state.artwork);

    useEffect(() => {
        dispatch(fetchFeaturedArtworks());
    }, [dispatch]);

    if (loading) return <Skeleton active />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6 max-w-full mx-auto">
            <Title level={3} className="mb-4">Featured Artworks</Title>
            {featuredArtworks.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {featuredArtworks.map((art) => (
                        <Card key={art.id} hoverable>
                            <Link to={`/artwork/${art.id}`}>
                                <Image src={art.image} alt={art.title} className="rounded-lg" />
                            </Link>
                            <Title level={5} className="mt-2">{art.title}</Title>
                            <p className="text-gray-600">{art.artist.username}</p>
                        </Card>
                    ))}
                </div>
            ) : (
                <Empty description="No featured artworks available" />
            )}
        </div>
    );
};

export default FeaturedArtworks;
