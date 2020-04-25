from django.shortcuts import render


def list(request):
	return render(request, 'list.html')


def home(request):
	return render(request, 'list.html')
