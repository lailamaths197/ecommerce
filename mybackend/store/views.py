import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Order

@csrf_exempt  # Bypass CSRF checks for this endpoint to support direct REST calls
def place_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            customer = data.get('customer', {})
            items = data.get('items', [])
            grand_total = data.get('grand_total', 0)

            # Insert record cleanly directly inside the SQLite structural engine
            order = Order.objects.create(
                full_name=customer.get('fullName'),
                email=customer.get('email'),
                address=customer.get('address'),
                grand_total=grand_total,
                items_json=json.dumps(items)
            )

            return JsonResponse({
                "status": "success",
                "message": "Order registered inside SQLite safely!",
                "order_id": order.id
            }, status=201)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)
