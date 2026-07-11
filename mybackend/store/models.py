from django.db import models

class Order(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    address = models.TextField()
    grand_total = models.DecimalField(max_digits=10, decimal_places=2)
    items_json = models.TextField()  # Serialized text storage representing array items
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.full_name}"
