from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

class UserAuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse("register")
        self.activate_url = reverse("activate")
        self.login_url = reverse("login")
        self.user_data = {
            "first_name": "Test",
            "last_name": "User",
            "email": "test@example.com",
            "password": "password123",
            "confirm_password": "password123",
            "mobile_phone": "01012345678",
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, "test@example.com")
        self.assertFalse(User.objects.get().is_active)

    def test_user_registration_invalid_data(self):
        invalid_data = self.user_data.copy()
        invalid_data["password"] = "short"
        response = self.client.post(self.register_url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        invalid_data = self.user_data.copy()
        invalid_data["mobile_phone"] = "123"
        response = self.client.post(self.register_url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_activation(self):
        self.client.post(self.register_url, self.user_data, format="json")
        user = User.objects.get(email="test@example.com")
        self.assertFalse(user.is_active)

        response = self.client.post(self.activate_url, {"email": "test@example.com"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.is_active)

    def test_user_login(self):
        self.client.post(self.register_url, self.user_data, format="json")
        self.client.post(self.activate_url, {"email": "test@example.com"}, format="json")

        login_data = {"email": "test@example.com", "password": "password123"}
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_user_login_inactive_account(self):
        self.client.post(self.register_url, self.user_data, format="json")
        login_data = {"email": "test@example.com", "password": "password123"}
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Account is not active.", response.data["non_field_errors"][0])

    def test_user_login_invalid_credentials(self):
        login_data = {"email": "test@example.com", "password": "wrongpassword"}
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid credentials.", response.data["non_field_errors"])
