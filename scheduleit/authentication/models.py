from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser, PermissionsMixin
)
from django.utils.translation import gettext as _
from django.core.validators import (
    EmailValidator,
    validate_image_file_extension,
)
from django.core.files.storage import default_storage
from PIL import Image
from django.core.files.images import ImageFile


def user_image_path(instance, filename):
    return f'users/user_{instance.id}_{instance.username}/{filename}'


class AppUserManager(BaseUserManager):


    def create_user(self, username, email, password=None,  **other_fields):

        if not username:
            raise ValueError(_("Users must have a usernanme"))

        if not email:
            raise ValueError(_("Users must have an email adress"))

        user = self.model(
            username=username,
            email=self.normalize_email(email),
             **other_fields
        )

        user.set_password(password)
        user.save()
        return user
    

    def create_superuser(self, username, email, password=None,  **other_fields):
        user = self.create_user(
            username=username,
            email=email,
            password=password,
             **other_fields
        )

        user.is_admin = True
        user.is_superuser = True
        user.save()
        return user


    def get_by_natural_key(self, username):
        return self.get(username__iexact=username)


class AppUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField(
        max_length=255,
        unique=True,
        verbose_name=_("email address"),
        validators=[
            EmailValidator(message=_("Enter a valid email address")),
        ]
    )
    image = models.ImageField(
        upload_to=user_image_path,
        verbose_name=_("user image"),
        default="users/default-user.jpg",
        validators = [validate_image_file_extension],
    )
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = AppUserManager()

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']


    def __str__(self):
        return self.username

    
    def has_perm(self, perm, obj=None):
        return True


    def has_module_perms(self, app_label):
        return True


    @property
    def is_staff(self):
        return self.is_admin


    def save(self, *args, **kwargs):
        super(AppUser, self).save(*args, **kwargs)
        if self.image:
            try:
                img = Image.open(self.image.path)
            except FileNotFoundError:
                img = ImageFile(default_storage.open('users/default-user.jpg'))
                self.image.save('default-user.jpg', img)

 
            if img.height > 400 or img.width > 400:
                size = (400, 400)
                img.thumbnail(size)
                img.save(self.image.path)