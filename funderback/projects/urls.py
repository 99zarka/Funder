from django.urls import path
from .views import ProjectListCreateView, ProjectDetailView, UserProjectListView, ProjectSearchByDateView, ProjectContributeView

urlpatterns = [
    path("", ProjectListCreateView.as_view(), name="project-list-create"),
    path("<int:pk>/", ProjectDetailView.as_view(), name="project-detail"),
    path("my-projects/", UserProjectListView.as_view(), name="user-project-list"),
    path("search/", ProjectSearchByDateView.as_view(), name="project-search-by-date"),
    path("<int:pk>/contribute/", ProjectContributeView.as_view(), name="project-contribute"),
]
