from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser
from rest_framework.generics import ListAPIView
from rest_framework import status
from .models import CustomUser
from .serializers import UserSerializer, ProfileUpdateSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import authenticate


User = get_user_model()

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        # Extract email and password from the request
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=400)

        # Authenticate user using email
        user = authenticate(request, username=email, password=password)

        if not user:
            return Response({"error": "Invalid credentials. Please try again."}, status=401)

        # Generate or retrieve token
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "user_id": user.id,
            "email": user.email,
            "role": user.role,  # Include role
        })



class UserListView(ListAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAdminUser]  # ✅ Only admins can view the user list
    serializer_class = UserSerializer

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print("UserDetailView accessed!")  # Debugging line
        print("User:", request.user)  # Check if user is retrieved correctly

        serializer = UserSerializer(request.user)
        print("Serialized Data:", serializer.data)  # Debugging line

        return Response(serializer.data)



class UpdateUserRoleView(APIView):
    permission_classes = [IsAdminUser]  # Only admins can update roles

    def patch(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        role = request.data.get("role")
        if role not in ["admin", "member", "visitor"]:
            return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

        user.role = role
        user.save()
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
    
    

class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Profile updated successfully", "data": serializer.data})
        return Response(serializer.errors, status=400)