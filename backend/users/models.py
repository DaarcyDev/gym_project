from django.db import models

# Create your models here.


class User(models.Model):
	name = models.CharField(max_length=50)
	lastname = models.CharField(max_length=50)
	gender = models.CharField(max_length=50)
	phoneNumber = models.DecimalField(max_digits=10, decimal_places=0)
	def __str__(self):
		return self.user

	class Meta:
		db_table = "users"
		verbose_name = "User"
		verbose_name_plural = "Users"
		ordering = ["-created_at"]