from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPageNumberPagination(PageNumberPagination):
    """
    Extends the default page number pagination and makes it return integer
    next and previous page numbers, as well as the total number of pages
    """

    def get_paginated_response(self, data):
        return Response({
            "count": self.page.paginator.count,
            "total_pages": self.page.paginator.num_pages,
            "next": self.page.next_page_number() if self.page.has_next() else None,
            "previous": self.page.previous_page_number() if self.page.has_previous() else None,
            "results": data,
        })

    def get_paginated_response_schema(self, schema):
        return {
            "type": "object",
            "required": ["count", "total_pages", "results"],
            "properties": {
                "count": {
                    "type": "integer",
                    "example": 123,
                },
                "total_pages": {
                    "type": "integer",
                    "example": 12,
                },
                "next": {
                    "type": "integer",
                    "nullable": True,
                    "example": 4,
                },
                "previous": {
                    "type": "integer",
                    "nullable": True,
                    "example": 2,
                },
                "results": schema,
            },
        }
