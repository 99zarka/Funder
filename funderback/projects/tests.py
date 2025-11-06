from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from projects.models import Project
from datetime import datetime, timedelta
from django.utils import timezone

User = get_user_model()

class ProjectAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="owner@example.com",
            first_name="Project",
            last_name="Owner",
            email="owner@example.com",
            password="password123",
            mobile_phone="01011111111",
            is_active=True
        )
        self.staff_user = User.objects.create_user(
            username="staff@example.com",
            first_name="Staff",
            last_name="User",
            email="staff@example.com",
            password="password123",
            mobile_phone="01022222222",
            is_active=True,
            is_staff=True
        )
        self.project_data = {
            "title": "Test Project",
            "details": "Details for test project.",
            "total_target": 1000.00,
            "start_time": (timezone.now() + timedelta(days=1)).isoformat(),
            "end_time": (timezone.now() + timedelta(days=30)).isoformat(),
        }
        self.project_list_create_url = reverse("project-list-create")
        self.user_projects_url = reverse("user-project-list")
        self.search_projects_url = reverse("project-search-by-date")

    def get_auth_headers(self, user):
        login_url = reverse("login")
        response = self.client.post(login_url, {"email": user.email, "password": "password123"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return {"HTTP_AUTHORIZATION": f"Bearer {response.data["access"]}"}

    def test_create_project_authenticated(self):
        headers = self.get_auth_headers(self.user)
        response = self.client.post(self.project_list_create_url, self.project_data, format="json", **headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 1)
        self.assertEqual(Project.objects.get().title, "Test Project")
        self.assertEqual(Project.objects.get().owner, self.user)

    def test_create_project_unauthenticated(self):
        response = self.client.post(self.project_list_create_url, self.project_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_view_all_projects(self):
        self.client.post(self.project_list_create_url, self.project_data, format="json", **self.get_auth_headers(self.user))
        response = self.client.get(self.project_list_create_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Test Project")

    def test_view_my_projects(self):
        self.client.post(self.project_list_create_url, self.project_data, format="json", **self.get_auth_headers(self.user))
        headers = self.get_auth_headers(self.user)
        response = self.client.get(self.user_projects_url, format="json", **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Test Project")

    def test_edit_own_project(self):
        create_response = self.client.post(self.project_list_create_url, self.project_data, format="json", **self.get_auth_headers(self.user))
        project_id = create_response.data["id"]
        edit_url = reverse("project-detail", kwargs={"pk": project_id})
        updated_data = {"title": "Updated Project Title"}
        headers = self.get_auth_headers(self.user)
        response = self.client.patch(edit_url, updated_data, format="json", **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Project.objects.get(id=project_id).title, "Updated Project Title")

    def test_edit_other_users_project(self):
        create_response = self.client.post(self.project_list_create_url, self.project_data, format="json", **self.get_auth_headers(self.user))
        project_id = create_response.data["id"]
        edit_url = reverse("project-detail", kwargs={"pk": project_id})
        updated_data = {"title": "Unauthorized Edit"}
        headers = self.get_auth_headers(self.staff_user) # Staff user tries to edit
        response = self.client.patch(edit_url, updated_data, format="json", **headers)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_own_project(self):
        create_response = self.client.post(self.project_list_create_url, self.project_data, format="json", **self.get_auth_headers(self.user))
        project_id = create_response.data["id"]
        delete_url = reverse("project-detail", kwargs={"pk": project_id})
        headers = self.get_auth_headers(self.user)
        response = self.client.delete(delete_url, **headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.count(), 0)

    def test_delete_other_users_project(self):
        create_response = self.client.post(self.project_list_create_url, self.project_data, format="json", **self.get_auth_headers(self.user))
        project_id = create_response.data["id"]
        delete_url = reverse("project-detail", kwargs={"pk": project_id})
        headers = self.get_auth_headers(self.staff_user) # Staff user tries to delete
        response = self.client.delete(delete_url, **headers)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.count(), 1)

    def test_search_projects_by_date(self):
        # Create a project that is active today
        active_project_data = self.project_data.copy()
        active_project_data["title"] = "Active Project"
        active_project_data["start_time"] = (timezone.now() - timedelta(days=5)).isoformat()
        active_project_data["end_time"] = (timezone.now() + timedelta(days=5)).isoformat()
        self.client.post(self.project_list_create_url, active_project_data, format="json", **self.get_auth_headers(self.user))

        # Create a project that is not active today
        inactive_project_data = self.project_data.copy()
        inactive_project_data["title"] = "Inactive Project"
        inactive_project_data["start_time"] = (timezone.now() - timedelta(days=10)).isoformat()
        inactive_project_data["end_time"] = (timezone.now() - timedelta(days=5)).isoformat()
        self.client.post(self.project_list_create_url, inactive_project_data, format="json", **self.get_auth_headers(self.user))

        today_str = timezone.now().strftime("%Y-%m-%d")
        response = self.client.get(f"{self.search_projects_url}?date={today_str}", format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Active Project")

    def test_search_projects_by_date_invalid_format(self):
        response = self.client.get(f"{self.search_projects_url}?date=invalid-date", format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["date"], "Invalid date format. Please use YYYY-MM-DD.")
