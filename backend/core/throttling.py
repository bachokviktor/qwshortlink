from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class RestrictedAnonThrottle(AnonRateThrottle):
    rate = "5/hour"
