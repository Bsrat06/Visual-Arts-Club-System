from rest_framework import serializers
from .models import Project, ProjectProgress
from users.models import CustomUser


class ProjectProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectProgress
        fields = '__all__'
        read_only_fields = ['project']



class ProjectSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(
    queryset=CustomUser.objects.all(), many=True, required=False  # ✅ Allow empty members list
    )
    image = serializers.ImageField(required=False, allow_null=True)
    updates = ProjectProgressSerializer(many=True, read_only=True)  # ✅ Include progress updates

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['creator']  # ✅ Prevent frontend from passing 'creator'
        extra_kwargs = {
            "title": {"required": True},
            "description": {"required": True},
        }

    def create(self, validated_data):
        request = self.context.get("request")
        creator = request.user if request else None  # ✅ Get logged-in user
        
        validated_data.pop("creator", None)  # ✅ Prevent duplicate 'creator' error

        members = validated_data.pop("members", [])  # ✅ Extract members
        project = Project.objects.create(creator=creator, **validated_data)  # ✅ Assign creator separately
        project.members.set(members)  # ✅ Add members separately
        return project

