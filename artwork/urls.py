from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArtworkViewSet, like_artwork, unlike_artwork, get_likes_count, LikedArtworksView

router = DefaultRouter()
router.register(r'artwork', ArtworkViewSet)

urlpatterns = router.urls + [
    path("artwork/<int:artwork_id>/like/", like_artwork, name="like_artwork"),
    path("artwork/<int:artwork_id>/unlike/", unlike_artwork, name="unlike_artwork"),
    path("artwork/<int:artwork_id>/likes/", get_likes_count, name="get_likes_count"),
    path("artworks/liked/", LikedArtworksView.as_view(), name="liked_artworks"),
]