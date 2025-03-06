from django.contrib import admin
from .models import Administrator, Trainer, Member, Attendance
# Register your models here.

class AdminUser(admin.ModelAdmin):
	readonly_fields = ('id','created_at',)
 
class TrainerUser(admin.ModelAdmin):
	readonly_fields = ('id','created_at',)
 
class MemberUser(admin.ModelAdmin):
	readonly_fields = ('id','created_at',)

admin.site.register(Administrator)
admin.site.register(Trainer)
admin.site.register(Member)
admin.site.register(Attendance)