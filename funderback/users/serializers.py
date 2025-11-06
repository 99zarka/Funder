from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
import re

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "password",
            "confirm_password",
            "mobile_phone",
        )
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if not re.match(r"^01[0-2,5]{1}[0-9]{8}$", data["mobile_phone"]):
            raise serializers.ValidationError({"mobile_phone": "Mobile phone number must be a valid Egyptian number."})
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            mobile_phone=validated_data["mobile_phone"],
            is_active=False
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if email and password:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise serializers.ValidationError({"non_field_errors": ["Invalid credentials."]})

            if not user.is_active:
                raise serializers.ValidationError({"non_field_errors": ["Account is not active."]})

            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError({"non_field_errors": ["Invalid credentials."]})
            data["user"] = user
        else:
            raise serializers.ValidationError("Must include \"email\" and \"password\".")
        return data
