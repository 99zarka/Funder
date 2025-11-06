from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import Project
from .serializers import ProjectSerializer

class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_update(self, serializer):
        if self.request.user != serializer.instance.owner:
            self.permission_denied(self.request)
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.owner:
            self.permission_denied(self.request)
        instance.delete()

class UserProjectListView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user).order_by("-start_time")

class ProjectSearchByDateView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        search_date_str = self.request.query_params.get("date")
        if search_date_str:
            try:
                search_date = timezone.datetime.strptime(search_date_str, "%Y-%m-%d").date()
                queryset = Project.objects.filter(
                    Q(start_time__date__lte=search_date) & Q(end_time__date__gte=search_date)
                ).order_by("-start_time")
                serializer = self.get_serializer(queryset, many=True)
                return Response(serializer.data)
            except ValueError:
                return Response({"date": "Invalid date format. Please use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
        return Response([])
