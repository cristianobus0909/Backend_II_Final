document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-id');
            try {
                const response = await fetch(`/api/carts/:cid/products/${productId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (response.ok) {
                    alert('Producto agregado al carrito');
                } else {
                    alert('Error al agregar al carrito');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
});
