git add mybackend/store/views.pyimport json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Order

@csrf_exempt
def place_order(request):
    if request.method == 'POST':
        try:
            # 1. Safely decode input bytes to raw text strings to prevent stream reading blockages
            body_unicode = request.body.decode('utf-8')
            if not body_unicode.strip():
                return JsonResponse({"status": "error", "message": "The incoming payload body is empty."}, status=400)
                
            data = json.loads(body_unicode)
            
            customer = data.get('customer', {})
            items = data.get('items', [])
            grand_total = data.get('grand_total', 0)

            # 2. Self-correcting object mapping checks every spelling variation automatically
            full_name = customer.get('fullName') or customer.get('fullname') or customer.get('name')
            email = customer.get('email')
            address = customer.get('address')

            # 3. Hard-stop validation check prevents structural null crashes in SQLite
            if not full_name or not email or not address:
                return JsonResponse({
                    "status": "error", 
                    "message": f"Validation Error: Received missing fields. Name: {full_name}, Email: {email}, Address: {address}"
                }, status=400)

            # 4. Save your transaction data cleanly right onto your production storage disk
            order = Order.objects.create(
                full_name=str(full_name).strip(),
                email=str(email).strip(),
                address=str(address).strip(),
                grand_total=float(grand_total),
                items_json=json.dumps(items)
            )

            return JsonResponse({
                "status": "success",
                "message": "Order processed and saved inside SQLite safely!",
                "order_id": order.id
            }, status=201)

        except json.JSONDecodeError as json_err:
            return JsonResponse({"status": "error", "message": f"Malformed JSON Payload: {str(json_err)}"}, status=400)
        except Exception as e:
            # Captures any other exception line and reports it safely to the response handler
            return JsonResponse({"status": "error", "message": f"Database Server Crash: {str(e)}"}, status=400)

    return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)