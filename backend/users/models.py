from django.db import models


GENDER_CHOICES = [
    ('male', 'Hombre'),
    ('female', 'Mujer'),
]
class Administrator(models.Model):
	id = models.AutoField(primary_key=True)
	username = models.CharField(max_length=150, unique=True)
	email = models.EmailField(unique=True)
	name = models.CharField(max_length=150)
	lastname = models.CharField(max_length=128)
	gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=False)
	phoneNumber = models.CharField(max_length=15)
	password = models.CharField(max_length=128)
	created_at = models.DateTimeField(auto_now_add=True)
	acces_token = models.CharField(max_length=128)
	
	def __str__(self):
		return self.username

	class Meta:
		db_table = 'administrators'
		ordering = ['-created_at']
		
		
class Trainer(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=150)
	lastname = models.CharField(max_length=128)
	gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=False)
	phoneNumber = models.CharField(max_length=15)
	password = models.CharField(max_length=128)
	created_at = models.DateTimeField(auto_now_add=True)
	acces_token = models.CharField(max_length=128)
	created_by = models.ForeignKey(
		Administrator, 
		on_delete=models.CASCADE, 
		related_name='trainers'
	)
	created_at = models.DateTimeField(auto_now_add=True)
	
	def __str__(self):
		return self.name + ' ' + self.lastname

	class Meta:
		db_table = 'trainers'
		ordering = ['-created_at']


class Member(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=150, unique=True)
	lastname = models.CharField(max_length=128)
	gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=False)
	phoneNumber = models.CharField(max_length=15)
	create_at = models.DateTimeField(auto_now_add=True)
	acces_token = models.CharField(max_length=128)
	created_by = models.ForeignKey(
		Administrator, 
		on_delete=models.CASCADE, 
		related_name='members'
	)
	# Asignación del entrenador; puede ser null si aún no se asigna
	trainer = models.ForeignKey(
		Trainer, 
		on_delete=models.SET_NULL, 
		null=True, 
		blank=True, 
		related_name='members'
	)
	created_at = models.DateTimeField(auto_now_add=True)
	
	def __str__(self):
		return self.name + ' ' + self.lastname

	class Meta:
		db_table = 'members'
		ordering = ['-created_at']


class Attendance(models.Model):
	member = models.ForeignKey(
		Member, 
		on_delete=models.CASCADE, 
		related_name='attendances'
	)
	timestamp = models.DateTimeField(auto_now_add=True)
	
	def __str__(self):
		return f"{self.member.username} - {self.timestamp}"

	class Meta:
		db_table = 'attendances'
		ordering = ['-timestamp']
