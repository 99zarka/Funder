from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ["username", "email", "mobile_phone", "is_active", "is_staff"]

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        if obj:
            fieldsets = fieldsets + (("Custom fields", {"fields": ("mobile_phone", "is_active")}),)
        return fieldsets

    def get_add_fieldsets(self, request, obj=None):
        add_fieldsets = super().get_add_fieldsets(request)
        add_fieldsets = add_fieldsets + (("Custom fields", {"fields": ("mobile_phone", "is_active")}),)
        return add_fieldsets

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        is_new_user = obj is None
        if is_new_user:
            form.base_fields["is_active"].initial = False
        return form




admin.site.register(User, CustomUserAdmin)
