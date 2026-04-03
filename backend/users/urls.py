from rest_framework.routers import SimpleRouter

from . import views


app_name = "users"

router = SimpleRouter()
router.register(r"", views.UserViewSet, basename="user")

urlpatterns = router.urls
