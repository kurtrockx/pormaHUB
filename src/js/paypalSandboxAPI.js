export function loadPaypal(clientId) {
  return new Promise((resolve, reject) => {
    if (window.paypal) {
      // If already loaded, resolve immediately
      resolve(window.paypal);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
    script.onload = () => resolve(window.paypal);
    script.onerror = () => reject(new Error("Failed to load PayPal SDK."));
    document.body.appendChild(script);
  });
}
