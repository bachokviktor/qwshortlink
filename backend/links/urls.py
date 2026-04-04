from rest_framework import routers

from . import views


app_name = "links"

router = routers.SimpleRouter()
router.register(r"", views.LinkViewSet, basename="link")

urlpatterns = router.urls
